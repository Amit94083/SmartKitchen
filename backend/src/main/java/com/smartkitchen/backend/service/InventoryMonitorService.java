package com.smartkitchen.backend.service;

import com.smartkitchen.backend.entity.Ingredient;
import com.smartkitchen.backend.entity.SupplierCategory;
import com.smartkitchen.backend.entity.SupplierMessage;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.repository.IngredientRepository;
import com.smartkitchen.backend.repository.SupplierCategoryRepository;
import com.smartkitchen.backend.repository.SupplierMessageRepository;
import com.smartkitchen.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InventoryMonitorService {

    private static final Logger logger = LoggerFactory.getLogger(InventoryMonitorService.class);

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    @Autowired
    private SupplierCategoryRepository supplierCategoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupplierMessageRepository supplierMessageRepository;

    @Value("${inventory.alert.phone.number}")
    private String alertPhoneNumber;

  
    @Scheduled(cron = "${inventory.alert.cron.expression}")
    public void checkInventoryLevels() {
        logger.info("=== Starting Scheduled Inventory Check ===");
        logger.info("Check Time: {}", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        try {
            // Find all ingredients with low stock
            List<Ingredient> lowStockIngredients = ingredientRepository.findLowStockIngredients();
            
            logger.info("Found {} ingredients with low stock", lowStockIngredients.size());

            if (!lowStockIngredients.isEmpty()) {
                // Send notification for low stock ingredients
                sendLowStockAlert(lowStockIngredients);
            } else {
                logger.info("All ingredients are sufficiently stocked");
            }

        } catch (Exception e) {
            logger.error("Error during inventory check: {}", e.getMessage(), e);
        }

        logger.info("=== Inventory Check Completed ===");
    }

    /**
     * Send WhatsApp alert for low stock ingredients to respective suppliers
     * Groups all ingredients by supplier and sends ONE merged message per supplier
     */
    private void sendLowStockAlert(List<Ingredient> lowStockIngredients) {
        logger.info("Preparing to send WhatsApp alerts to suppliers for {} low stock ingredients", lowStockIngredients.size());

        // Group ingredients by supplier - each supplier gets ONE message with ALL their ingredients
        Map<Long, List<Ingredient>> ingredientsBySupplier = new HashMap<>();
        List<Ingredient> unassignedIngredients = new ArrayList<>();

        for (Ingredient ingredient : lowStockIngredients) {
            String category = ingredient.getIngredientType();
            
            // Find supplier assigned to this category
            Optional<SupplierCategory> supplierCategoryOpt = supplierCategoryRepository.findByCategoryName(category);

            if (supplierCategoryOpt.isEmpty()) {
                logger.warn("No supplier assigned to category '{}' for ingredient '{}'", category, ingredient.getName());
                unassignedIngredients.add(ingredient);
                continue;
            }

            Long supplierId = supplierCategoryOpt.get().getUserId();
            ingredientsBySupplier.computeIfAbsent(supplierId, k -> new ArrayList<>()).add(ingredient);
        }

        logger.info("Ingredients grouped for {} suppliers, {} unassigned ingredients", 
            ingredientsBySupplier.size(), unassignedIngredients.size());

        // Send merged alert to each supplier
        for (Map.Entry<Long, List<Ingredient>> entry : ingredientsBySupplier.entrySet()) {
            Long supplierId = entry.getKey();
            List<Ingredient> supplierIngredients = entry.getValue();

            Optional<User> supplierOpt = userRepository.findById(supplierId);

            if (supplierOpt.isEmpty()) {
                logger.error("Supplier with ID {} not found", supplierId);
                unassignedIngredients.addAll(supplierIngredients);
                continue;
            }

            User supplier = supplierOpt.get();
            String supplierPhone = supplier.getPhone();

            if (supplierPhone == null || supplierPhone.trim().isEmpty()) {
                logger.warn("Supplier '{}' has no phone number. Adding to unassigned.", supplier.getName());
                unassignedIngredients.addAll(supplierIngredients);
                continue;
            }

            // Build and send merged message to supplier
            sendMergedAlertToSupplier(supplier, supplierIngredients);
        }

        // Send unassigned ingredients to default number
        if (!unassignedIngredients.isEmpty()) {
            sendUnassignedAlertToDefaultNumber(unassignedIngredients);
        }
    }

    /**
     * Send merged alert to a specific supplier with all their low stock ingredients
     */
    private void sendMergedAlertToSupplier(User supplier, List<Ingredient> ingredients) {
        // Filter ingredients that haven't been alerted in the last 24 hours
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        List<Ingredient> ingredientsToAlert = new ArrayList<>();
        
        for (Ingredient ingredient : ingredients) {
            boolean recentlySent = supplierMessageRepository.existsBySupplierIdAndIngredientNameAndCreatedAtAfter(
                supplier.getId(),
                ingredient.getName(),
                twentyFourHoursAgo
            );
            
            if (!recentlySent) {
                ingredientsToAlert.add(ingredient);
            } else {
                logger.info("Skipping ingredient '{}' for supplier '{}' - alert sent within last 24 hours",
                    ingredient.getName(), supplier.getName());
            }
        }
        
        // If no ingredients to alert, skip sending message
        if (ingredientsToAlert.isEmpty()) {
            logger.info("No new ingredients to alert for supplier '{}' - all were recently notified", supplier.getName());
            return;
        }
        
        // Group ingredients by category for better organization in the message
        Map<String, List<Ingredient>> ingredientsByCategory = ingredientsToAlert.stream()
            .collect(Collectors.groupingBy(Ingredient::getIngredientType));
        
        StringBuilder message = new StringBuilder();
        message.append(String.format("Hello *%s*,\n\n", supplier.getName()));
        message.append("We are running low on the following items:\n\n");

        for (Map.Entry<String, List<Ingredient>> categoryEntry : ingredientsByCategory.entrySet()) {
            String category = categoryEntry.getKey();
            List<Ingredient> categoryIngredients = categoryEntry.getValue();
            
            message.append(String.format("*%s:*\n", category));
            for (Ingredient ingredient : categoryIngredients) {
                message.append(String.format("  • %s\n", ingredient.getName()));
            }
            message.append("\n");
        }

        message.append("Please arrange delivery as soon as possible.\n");
        message.append(String.format("Total items: %d", ingredientsToAlert.size()));

        // Send WhatsApp message
        try {
            Map<String, Object> result = whatsAppService.sendTextMessage(supplier.getPhone(), message.toString());
            
            if (result.get("success").equals(true)) {
                logger.info("Merged low stock alert sent successfully to supplier '{}' ({}) with {} items across {} categories", 
                    supplier.getName(), supplier.getPhone(), ingredientsToAlert.size(), ingredientsByCategory.size());
                
                // Save message records for each ingredient
                for (Ingredient ingredient : ingredientsToAlert) {
                    SupplierMessage supplierMessage = new SupplierMessage(
                        supplier.getId(),
                        ingredient.getName(),
                        ingredient.getIngredientType()
                    );
                    supplierMessageRepository.save(supplierMessage);
                }
            } else {
                logger.error("Failed to send merged low stock alert to supplier '{}': {}", 
                    supplier.getName(), result.get("error"));
            }
        } catch (Exception e) {
            logger.error("Error sending WhatsApp alert to supplier '{}': {}", 
                supplier.getName(), e.getMessage(), e);
        }
    }

    /**
     * Send alert to default number for unassigned ingredients
     */
    private void sendUnassignedAlertToDefaultNumber(List<Ingredient> ingredients) {
        // Filter ingredients that haven't been alerted in the last 24 hours (for default number)
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        List<Ingredient> ingredientsToAlert = new ArrayList<>();
        
        for (Ingredient ingredient : ingredients) {
            boolean recentlySent = supplierMessageRepository.existsBySupplierIdAndIngredientNameAndCreatedAtAfter(
                null,
                ingredient.getName(),
                twentyFourHoursAgo
            );
            
            if (!recentlySent) {
                ingredientsToAlert.add(ingredient);
            } else {
                logger.info("Skipping ingredient '{}' for default alert - alert sent within last 24 hours",
                    ingredient.getName());
            }
        }
        
        // If no ingredients to alert, skip sending message
        if (ingredientsToAlert.isEmpty()) {
            logger.info("No new unassigned ingredients to alert to default number - all were recently notified");
            return;
        }
        
        // Group ingredients by category for better organization
        Map<String, List<Ingredient>> ingredientsByCategory = ingredientsToAlert.stream()
            .collect(Collectors.groupingBy(Ingredient::getIngredientType));
        
        StringBuilder message = new StringBuilder();
        message.append("🚨 *Low Stock Alert - Unassigned Ingredients* 🚨\n\n");
        message.append("The following items need supplier assignment:\n\n");

        for (Map.Entry<String, List<Ingredient>> categoryEntry : ingredientsByCategory.entrySet()) {
            String category = categoryEntry.getKey();
            List<Ingredient> categoryIngredients = categoryEntry.getValue();
            
            message.append(String.format("*%s (No supplier):*\n", category));
            for (Ingredient ingredient : categoryIngredients) {
                message.append(String.format("  • %s\n", ingredient.getName()));
            }
            message.append("\n");
        }

        message.append("Please assign suppliers or arrange delivery.\n");
        message.append(String.format("Total items: %d", ingredientsToAlert.size()));

        try {
            Map<String, Object> result = whatsAppService.sendTextMessage(alertPhoneNumber, message.toString());
            
            if (result.get("success").equals(true)) {
                logger.info("Unassigned low stock alert sent to default number with {} items", ingredientsToAlert.size());
                
                // Save message records with null supplierId (no supplier assigned)
                for (Ingredient ingredient : ingredientsToAlert) {
                    SupplierMessage supplierMessage = new SupplierMessage(
                        null,
                        ingredient.getName(),
                        ingredient.getIngredientType()
                    );
                    supplierMessageRepository.save(supplierMessage);
                }
            } else {
                logger.error("Failed to send unassigned alert to default number: {}", result.get("error"));
            }
        } catch (Exception e) {
            logger.error("Error sending WhatsApp alert to default number: {}", e.getMessage(), e);
        }
    }

    /**
     * Manual trigger method for testing purposes
     * Can be called via REST endpoint if needed
     */
    public Map<String, Object> triggerManualCheck() {
        logger.info("Manual inventory check triggered");
        checkInventoryLevels();
        return Map.of("success", true, "message", "Manual inventory check completed");
    }
}
