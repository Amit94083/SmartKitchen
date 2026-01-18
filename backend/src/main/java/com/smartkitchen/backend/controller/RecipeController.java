package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.RecipeDTO;
import com.smartkitchen.backend.entity.Recipe;
import com.smartkitchen.backend.entity.MenuItem;
import com.smartkitchen.backend.entity.Ingredient;
import com.smartkitchen.backend.repository.RecipeRepository;
import com.smartkitchen.backend.repository.MenuItemRepository;
import com.smartkitchen.backend.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private IngredientRepository ingredientRepository;

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes() {
        try {
            List<Recipe> recipes = recipeRepository.findAll();
            List<RecipeDTO> recipeDTOs = recipes.stream()
                .map(recipe -> new RecipeDTO(
                    recipe.getId(),
                    recipe.getMenuItem().getItemId(),
                    recipe.getMenuItem().getName(),
                    recipe.getMenuItem().getCategory(),
                    recipe.getMenuItem().getDescription(),
                    recipe.getIngredient().getIngredientId(),
                    recipe.getIngredient().getName(),
                    recipe.getIngredient().getUnit(),
                    recipe.getQuantityRequired()
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(recipeDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/menu-item/{menuItemId}")
    public ResponseEntity<List<Recipe>> getRecipesByMenuItem(@PathVariable Long menuItemId) {
        List<Recipe> recipes = recipeRepository.findByMenuItemItemId(menuItemId);
        return ResponseEntity.ok(recipes);
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody Map<String, Object> recipeData) {
        try {
            Long menuItemId = Long.valueOf(recipeData.get("menuItemId").toString());
            Long ingredientId = Long.valueOf(recipeData.get("ingredientId").toString());
            Double quantityRequired = Double.valueOf(recipeData.get("quantityRequired").toString());
            
            MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
            
            Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
            
            Recipe recipe = new Recipe(menuItem, ingredient, quantityRequired);
            Recipe saved = recipeRepository.save(recipe);
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating recipe: " + e.getMessage());
        }
    }
    
    @PostMapping("/batch")
    public ResponseEntity<?> createBatchRecipes(@RequestBody Map<String, Object> batchData) {
        try {
            Long menuItemId = Long.valueOf(batchData.get("menuItemId").toString());
            List<Map<String, Object>> ingredients = (List<Map<String, Object>>) batchData.get("ingredients");
            
            MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
            
            List<Recipe> recipes = ingredients.stream().map(ingData -> {
                Long ingredientId = Long.valueOf(ingData.get("ingredientId").toString());
                Double quantityRequired = Double.valueOf(ingData.get("quantityRequired").toString());
                
                Ingredient ingredient = ingredientRepository.findById(ingredientId)
                    .orElseThrow(() -> new RuntimeException("Ingredient not found"));
                
                return new Recipe(menuItem, ingredient, quantityRequired);
            }).collect(Collectors.toList());
            
            List<Recipe> savedRecipes = recipeRepository.saveAll(recipes);
            return ResponseEntity.ok(savedRecipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating recipes: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        recipeRepository.deleteById(id);
        return ResponseEntity.ok("Recipe deleted successfully");
    }
    
    @DeleteMapping("/menu-item/{menuItemId}")
    public ResponseEntity<?> deleteRecipesByMenuItem(@PathVariable Long menuItemId) {
        try {
            List<Recipe> recipes = recipeRepository.findByMenuItemItemId(menuItemId);
            recipeRepository.deleteAll(recipes);
            return ResponseEntity.ok("Recipes deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
