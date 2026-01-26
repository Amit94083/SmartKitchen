package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.entity.Ingredient;
import com.smartkitchen.backend.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ingredients/calc")
public class IngredientCalculationController {
    @Autowired
    private IngredientRepository ingredientRepository;

    @GetMapping("/percentages")
    public List<IngredientPercentage> getIngredientPercentages() {
        return ingredientRepository.findAll().stream()
                .map(ingredient -> new IngredientPercentage(
                        ingredient.getIngredientId(),
                        ingredient.getName(),
                        ingredient.getCurrentQuantity(),
                        ingredient.getMaxQuantity(),
                        ingredient.getMaxQuantity() != null && ingredient.getMaxQuantity() > 0 ?
                                (ingredient.getCurrentQuantity() / ingredient.getMaxQuantity()) * 100 : null
                ))
                .collect(Collectors.toList());
    }

    public static class IngredientPercentage {
        private Long ingredientId;
        private String name;
        private Double currentQuantity;
        private Double maxQuantity;
        private Double percentage;

        public IngredientPercentage(Long ingredientId, String name, Double currentQuantity, Double maxQuantity, Double percentage) {
            this.ingredientId = ingredientId;
            this.name = name;
            this.currentQuantity = currentQuantity;
            this.maxQuantity = maxQuantity;
            this.percentage = percentage;
        }

        public Long getIngredientId() { return ingredientId; }
        public String getName() { return name; }
        public Double getCurrentQuantity() { return currentQuantity; }
        public Double getMaxQuantity() { return maxQuantity; }
        public Double getPercentage() { return percentage; }
    }
}
