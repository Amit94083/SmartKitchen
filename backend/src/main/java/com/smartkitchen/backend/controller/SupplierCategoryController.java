package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.entity.SupplierCategory;
import com.smartkitchen.backend.service.SupplierCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/supplier-categories")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierCategoryController {
    
    @Autowired
    private SupplierCategoryService supplierCategoryService;
    
    /**
     * Get all categories for a specific supplier
     */
    @GetMapping("/supplier/{userId}")
    public ResponseEntity<List<SupplierCategory>> getSupplierCategories(@PathVariable Long userId) {
        try {
            List<SupplierCategory> categories = supplierCategoryService.getSupplierCategories(userId);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get the supplier for a specific category
     */
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<?> getSupplierForCategory(@PathVariable String categoryName) {
        try {
            return supplierCategoryService.getSupplierForCategory(categoryName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Add a category to a supplier
     */
    @PostMapping("/supplier/{userId}/category")
    public ResponseEntity<?> addCategoryToSupplier(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        try {
            String categoryName = request.get("categoryName");
            if (categoryName == null || categoryName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Category name is required"));
            }
            
            SupplierCategory supplierCategory = supplierCategoryService.addCategoryToSupplier(userId, categoryName);
            return ResponseEntity.status(HttpStatus.CREATED).body(supplierCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to add category"));
        }
    }
    
    /**
     * Update all categories for a supplier (replace existing)
     */
    @PutMapping("/supplier/{userId}/categories")
    public ResponseEntity<?> updateSupplierCategories(
            @PathVariable Long userId,
            @RequestBody Map<String, List<String>> request) {
        try {
            List<String> categoryNames = request.get("categories");
            if (categoryNames == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Categories list is required"));
            }
            
            List<SupplierCategory> updatedCategories = supplierCategoryService.updateSupplierCategories(userId, categoryNames);
            return ResponseEntity.ok(updatedCategories);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to update categories: " + e.getMessage()));
        }
    }
    
    /**
     * Remove a specific category (from any supplier)
     */
    @DeleteMapping("/category/{categoryName}")
    public ResponseEntity<?> removeCategory(@PathVariable String categoryName) {
        try {
            supplierCategoryService.removeCategory(categoryName);
            return ResponseEntity.ok(Map.of("message", "Category removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to remove category"));
        }
    }
    
    /**
     * Remove all categories from a supplier
     */
    @DeleteMapping("/supplier/{userId}/categories")
    public ResponseEntity<?> removeAllCategoriesFromSupplier(@PathVariable Long userId) {
        try {
            supplierCategoryService.removeAllCategoriesFromSupplier(userId);
            return ResponseEntity.ok(Map.of("message", "All categories removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to remove categories"));
        }
    }
    
    /**
     * Get all supplier-category mappings
     */
    @GetMapping
    public ResponseEntity<List<SupplierCategory>> getAllSupplierCategories() {
        try {
            List<SupplierCategory> allCategories = supplierCategoryService.getAllSupplierCategories();
            return ResponseEntity.ok(allCategories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
