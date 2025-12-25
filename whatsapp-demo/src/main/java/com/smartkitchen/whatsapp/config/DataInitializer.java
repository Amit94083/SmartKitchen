package com.smartkitchen.whatsapp.config;

import com.smartkitchen.whatsapp.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private InventoryService inventoryService;
    
    @Override
    public void run(String... args) throws Exception {
        inventoryService.initializeMenu();
        inventoryService.initializeInventory();
        System.out.println("✅ Initial data loaded successfully!");
    }
}