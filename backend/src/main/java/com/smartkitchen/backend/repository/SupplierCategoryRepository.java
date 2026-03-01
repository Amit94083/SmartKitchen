package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.SupplierCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierCategoryRepository extends JpaRepository<SupplierCategory, Long> {
    
    /**
     * Find all categories for a specific supplier (user)
     */
    List<SupplierCategory> findByUserId(Long userId);
    
    /**
     * Find the supplier for a specific category (should return only one due to unique constraint)
     */
    Optional<SupplierCategory> findByCategoryName(String categoryName);
    
    /**
     * Check if a category is already assigned to any supplier
     */
    boolean existsByCategoryName(String categoryName);
    
    /**
     * Check if a category is assigned to a specific supplier
     */
    boolean existsByUserIdAndCategoryName(Long userId, String categoryName);
    
    /**
     * Delete a specific category assignment
     */
    @Transactional
    @Modifying
    void deleteByCategoryName(String categoryName);
    
    /**
     * Delete all categories for a supplier
     */
    @Transactional
    @Modifying
    void deleteByUserId(Long userId);
}
