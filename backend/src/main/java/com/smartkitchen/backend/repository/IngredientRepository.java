package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    // Custom query methods if needed
}
