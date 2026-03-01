package com.smartkitchen.backend.service;

import com.smartkitchen.backend.entity.SupplierCategory;
import com.smartkitchen.backend.repository.SupplierCategoryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierCategoryService {
    
    @Autowired
    private SupplierCategoryRepository supplierCategoryRepository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    /**
     * Get all categories for a specific supplier
     */
    public List<SupplierCategory> getSupplierCategories(Long userId) {
        return supplierCategoryRepository.findByUserId(userId);
    }
    
    /**
     * Get the supplier for a specific category
     */
    public Optional<SupplierCategory> getSupplierForCategory(String categoryName) {
        return supplierCategoryRepository.findByCategoryName(categoryName);
    }
    
    /**
     * Add a category to a supplier
     * Only one supplier can have each category
     */
    @Transactional
    public SupplierCategory addCategoryToSupplier(Long userId, String categoryName) {
        // Check if the category is already assigned to another supplier
        Optional<SupplierCategory> existingAssignment = supplierCategoryRepository.findByCategoryName(categoryName);
        if (existingAssignment.isPresent()) {
            if (!existingAssignment.get().getUserId().equals(userId)) {
                throw new RuntimeException("Category '" + categoryName + "' is already assigned to another supplier");
            }
            // Already assigned to this supplier, return existing
            return existingAssignment.get();
        }
        
        SupplierCategory supplierCategory = new SupplierCategory(userId, categoryName);
        return supplierCategoryRepository.save(supplierCategory);
    }
    
    /**
     * Update supplier categories - replace all existing categories for this supplier
     * Validates that categories are not assigned to other suppliers
     */
    @Transactional
    public List<SupplierCategory> updateSupplierCategories(Long userId, List<String> categoryNames) {
        // First, check if any of the new categories are assigned to other suppliers
        for (String categoryName : categoryNames) {
            Optional<SupplierCategory> existingAssignment = supplierCategoryRepository.findByCategoryName(categoryName);
            if (existingAssignment.isPresent() && !existingAssignment.get().getUserId().equals(userId)) {
                throw new RuntimeException("Category '" + categoryName + "' is already assigned to another supplier");
            }
        }
        
        // Delete existing categories for this supplier
        supplierCategoryRepository.deleteByUserId(userId);
        // Flush to ensure deletions are committed before inserting new records
        entityManager.flush();
        
        // Add new categories
        List<SupplierCategory> newCategories = categoryNames.stream()
            .map(categoryName -> new SupplierCategory(userId, categoryName))
            .toList();
        
        return supplierCategoryRepository.saveAll(newCategories);
    }
    
    /**
     * Remove a specific category (from any supplier)
     */
    @Transactional
    public void removeCategory(String categoryName) {
        supplierCategoryRepository.deleteByCategoryName(categoryName);
    }
    
    /**
     * Remove all categories from a supplier
     */
    @Transactional
    public void removeAllCategoriesFromSupplier(Long userId) {
        supplierCategoryRepository.deleteByUserId(userId);
    }
    
    /**
     * Get all categories with their assignments
     */
    public List<SupplierCategory> getAllSupplierCategories() {
        return supplierCategoryRepository.findAll();
    }
}
