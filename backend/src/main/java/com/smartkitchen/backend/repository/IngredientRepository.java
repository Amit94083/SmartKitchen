package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    
    /**
     * Find all active ingredients where current quantity is at or below threshold
     */
    @Query("SELECT i FROM Ingredient i WHERE i.currentQuantity <= i.thresholdQuantity AND i.isActive = true")
    List<Ingredient> findLowStockIngredients();
}
