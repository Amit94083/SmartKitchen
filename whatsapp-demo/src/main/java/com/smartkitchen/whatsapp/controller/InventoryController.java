package com.smartkitchen.whatsapp.controller;

import com.smartkitchen.whatsapp.dto.OrderRequest;
import com.smartkitchen.whatsapp.dto.OrderResponse;
import com.smartkitchen.whatsapp.entity.Inventory;
import com.smartkitchen.whatsapp.entity.Menu;
import com.smartkitchen.whatsapp.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;
    
    @GetMapping("/menu")
    public ResponseEntity<List<Menu>> getMenu() {
        List<Menu> menu = inventoryService.getAllMenuItems();
        return ResponseEntity.ok(menu);
    }
    
    @GetMapping("/current")
    public ResponseEntity<Inventory> getCurrentInventory() {
        Inventory inventory = inventoryService.getCurrentInventory();
        return ResponseEntity.ok(inventory);
    }
    
    @PostMapping("/order")
    public ResponseEntity<OrderResponse> processOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse response = inventoryService.processOrder(orderRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeData() {
        inventoryService.initializeInventory();
        inventoryService.initializeMenu();
        return ResponseEntity.ok("Data initialized successfully!");
    }
}