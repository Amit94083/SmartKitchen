package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.SupplierMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SupplierMessageRepository extends JpaRepository<SupplierMessage, Long> {
    
    /**
     * Find all messages for a specific supplier
     */
    List<SupplierMessage> findBySupplierId(Long supplierId);
    
    /**
     * Find all messages for a specific ingredient type
     */
    List<SupplierMessage> findByIngredientType(String ingredientType);
    
    /**
     * Find messages created after a specific date
     */
    List<SupplierMessage> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find messages for a specific supplier and ingredient type
     */
    List<SupplierMessage> findBySupplierIdAndIngredientType(Long supplierId, String ingredientType);
    
    /**
     * Check if a message was sent for a specific ingredient to a supplier within a time range
     */
    boolean existsBySupplierIdAndIngredientNameAndCreatedAtAfter(Long supplierId, String ingredientName, LocalDateTime createdAt);
}
