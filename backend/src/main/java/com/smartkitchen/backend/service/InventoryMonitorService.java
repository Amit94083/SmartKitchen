package com.smartkitchen.backend.service;

import com.smartkitchen.backend.entity.Ingredient;
import com.smartkitchen.backend.repository.IngredientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class InventoryMonitorService {

    private static final Logger logger = LoggerFactory.getLogger(InventoryMonitorService.class);

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    @Value("${inventory.alert.phone.number}")
    private String alertPhoneNumber;

  
    @Scheduled(cron = "0 */25 * * * *")
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
     * Send WhatsApp alert for low stock ingredients
     */
    private void sendLowStockAlert(List<Ingredient> lowStockIngredients) {
        logger.info("Preparing to send WhatsApp alert for {} low stock ingredients", lowStockIngredients.size());

        // Build the alert message
        StringBuilder message = new StringBuilder();
        message.append("🚨 *Low Stock Alert* 🚨\n\n");
        message.append("The following ingredients are running low:\n\n");

        for (Ingredient ingredient : lowStockIngredients) {
            message.append(String.format("• *%s*\n", ingredient.getName()));
            message.append(String.format("  Current: %.2f %s\n", ingredient.getCurrentQuantity(), ingredient.getUnit()));
            message.append(String.format("  Threshold: %.2f %s\n", ingredient.getThresholdQuantity(), ingredient.getUnit()));
            
            // Calculate percentage of stock remaining
            double percentageRemaining = (ingredient.getCurrentQuantity() / ingredient.getThresholdQuantity()) * 100;
            if (percentageRemaining <= 50) {
                message.append("  ⚠️ CRITICAL - ");
            } else {
                message.append("  ⚡ ");
            }
            message.append(String.format("%.1f%% of threshold\n\n", percentageRemaining));
        }

        message.append(String.format("_Alert Time: %s_", 
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm"))));

        // Send WhatsApp message
        try {
            Map<String, Object> result = whatsAppService.sendTextMessage(alertPhoneNumber, message.toString());
            
            if (result.get("success").equals(true)) {
                logger.info("Low stock alert sent successfully to {}", alertPhoneNumber);
            } else {
                logger.error("Failed to send low stock alert: {}", result.get("error"));
            }
        } catch (Exception e) {
            logger.error("Error sending WhatsApp alert: {}", e.getMessage(), e);
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
