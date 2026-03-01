package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.entity.Ingredient;
import com.smartkitchen.backend.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin(origins = "*")
public class IngredientController {
    @Autowired
    private IngredientRepository ingredientRepository;

    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Ingredient> createIngredient(@RequestBody Ingredient ingredient) {
        ingredient.setCreatedAt(LocalDateTime.now());
        ingredient.setMaxQuantity(10000.0); // Set maxQuantity to 10000 for new ingredient
        Ingredient saved = ingredientRepository.save(ingredient);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Long id, @RequestBody Ingredient ingredient) {
        return ingredientRepository.findById(id)
            .map(existing -> {
                existing.setName(ingredient.getName());
                existing.setIngredientType(ingredient.getIngredientType());
                existing.setUnit(ingredient.getUnit());
                existing.setCurrentQuantity(ingredient.getCurrentQuantity());
                // Only update maxQuantity if provided (not null)
                if (ingredient.getMaxQuantity() != null) {
                    existing.setMaxQuantity(ingredient.getMaxQuantity());
                }
                existing.setThresholdQuantity(ingredient.getThresholdQuantity());
                existing.setIsActive(ingredient.getIsActive());
                existing.setLastModifiedAt(LocalDateTime.now());
                Ingredient updated = ingredientRepository.save(existing);
                return ResponseEntity.ok(updated);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getDistinctIngredientTypes() {
        List<String> ingredientTypes = ingredientRepository.findDistinctIngredientTypes();
        return ResponseEntity.ok(ingredientTypes);
    }
}
