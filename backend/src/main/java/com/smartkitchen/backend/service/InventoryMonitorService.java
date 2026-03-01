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
     */
    private void sendLowStockAlert(List<Ingredient> lowStockIngredients) {
        logger.info("Preparing to send WhatsApp alerts to suppliers for {} low stock ingredients", lowStockIngredients.size());

        // Group ingredients by category (ingredient type)
        Map<String, List<Ingredient>> ingredientsByCategory = lowStockIngredients.stream()
            .collect(Collectors.groupingBy(Ingredient::getIngredientType));

        logger.info("Ingredients grouped into {} categories", ingredientsByCategory.size());

        // Send alert to each supplier based on their assigned category
        for (Map.Entry<String, List<Ingredient>> entry : ingredientsByCategory.entrySet()) {
            String category = entry.getKey();
            List<Ingredient> categoryIngredients = entry.getValue();

            logger.info("Processing category '{}' with {} low stock items", category, categoryIngredients.size());

            // Find supplier assigned to this category
            Optional<SupplierCategory> supplierCategoryOpt = supplierCategoryRepository.findByCategoryName(category);

            if (supplierCategoryOpt.isEmpty()) {
                logger.warn("No supplier assigned to category '{}'. Sending to default alert number.", category);
                sendAlertToDefaultNumber(category, categoryIngredients);
                continue;
            }

            Long supplierId = supplierCategoryOpt.get().getUserId();
            Optional<User> supplierOpt = userRepository.findById(supplierId);

            if (supplierOpt.isEmpty()) {
                logger.error("Supplier with ID {} not found for category '{}'", supplierId, category);
                sendAlertToDefaultNumber(category, categoryIngredients);
                continue;
            }

            User supplier = supplierOpt.get();
            String supplierPhone = supplier.getPhone();

            if (supplierPhone == null || supplierPhone.trim().isEmpty()) {
                logger.warn("Supplier '{}' has no phone number. Sending to default alert number.", supplier.getName());
                sendAlertToDefaultNumber(category, categoryIngredients);
                continue;
            }

            // Build and send message to supplier
            sendAlertToSupplier(supplier, category, categoryIngredients);
        }
    }

    /**
     * Send alert to a specific supplier
     */
    private void sendAlertToSupplier(User supplier, String category, List<Ingredient> ingredients) {
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
        
        StringBuilder message = new StringBuilder();
        message.append(String.format("Hello *%s*,\n\n", supplier.getName()));
        message.append("We are running out of the following items:\n\n");

        for (Ingredient ingredient : ingredientsToAlert) {
            message.append(String.format("• %s\n", ingredient.getName()));
        }

        message.append("\nPlease arrange delivery as soon as possible.");

        // Send WhatsApp message
        try {
            Map<String, Object> result = whatsAppService.sendTextMessage(supplier.getPhone(), message.toString());
            
            if (result.get("success").equals(true)) {
                logger.info("Low stock alert sent successfully to supplier '{}' ({}) for category '{}' with {} items", 
                    supplier.getName(), supplier.getPhone(), category, ingredientsToAlert.size());
                
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
                logger.error("Failed to send low stock alert to supplier '{}': {}", 
                    supplier.getName(), result.get("error"));
            }
        } catch (Exception e) {
            logger.error("Error sending WhatsApp alert to supplier '{}': {}", 
                supplier.getName(), e.getMessage(), e);
        }
    }

    /**
     * Send alert to default number when no supplier is assigned
     */
    private void sendAlertToDefaultNumber(String category, List<Ingredient> ingredients) {
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
            logger.info("No new ingredients to alert to default number - all were recently notified");
            return;
        }
        
        StringBuilder message = new StringBuilder();
        message.append("🚨 *Low Stock Alert* 🚨\n\n");
        message.append(String.format("*Category: %s* (No supplier assigned)\n\n", category));
        message.append("We are running out of the following items:\n\n");

        for (Ingredient ingredient : ingredientsToAlert) {
            message.append(String.format("• %s\n", ingredient.getName()));
        }

        message.append("\nPlease arrange delivery as soon as possible.");

        try {
            Map<String, Object> result = whatsAppService.sendTextMessage(alertPhoneNumber, message.toString());
            
            if (result.get("success").equals(true)) {
                logger.info("Low stock alert sent to default number for unassigned category '{}' with {} items", 
                    category, ingredientsToAlert.size());
                
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
                logger.error("Failed to send low stock alert to default number: {}", result.get("error"));
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
