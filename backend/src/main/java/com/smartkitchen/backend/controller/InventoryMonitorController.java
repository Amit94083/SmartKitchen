package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.service.InventoryMonitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryMonitorController {

    @Autowired
    private InventoryMonitorService inventoryMonitorService;

    /**
     * Manual trigger endpoint for testing inventory check
     * POST /api/inventory/check-now
     */
    @PostMapping("/check-now")
    public ResponseEntity<Map<String, Object>> triggerInventoryCheck() {
        Map<String, Object> result = inventoryMonitorService.triggerManualCheck();
        return ResponseEntity.ok(result);
    }
}
