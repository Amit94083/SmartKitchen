package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.Recipe;
import com.smartkitchen.backend.entity.MenuItem;
import com.smartkitchen.backend.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    
    // Find all recipes for a specific menu item
    List<Recipe> findByMenuItem(MenuItem menuItem);
    
    // Find all recipes for a specific menu item by item ID
    List<Recipe> findByMenuItemItemId(Long itemId);
    
    // Find all recipes that use a specific ingredient
    List<Recipe> findByIngredient(Ingredient ingredient);
    
    // Find all recipes that use a specific ingredient by ingredient ID
    List<Recipe> findByIngredientIngredientId(Long ingredientId);
    
    // Find a specific recipe by menu item and ingredient
    Optional<Recipe> findByMenuItemAndIngredient(MenuItem menuItem, Ingredient ingredient);
    
    // Find recipe by menu item ID and ingredient ID
    Optional<Recipe> findByMenuItemItemIdAndIngredientIngredientId(Long itemId, Long ingredientId);
    
    // Custom query to get recipes with ingredient details for a menu item
    @Query("SELECT r FROM Recipe r JOIN FETCH r.ingredient WHERE r.menuItem.itemId = :itemId")
    List<Recipe> findRecipesWithIngredientsByMenuItemId(@Param("itemId") Long itemId);
    
    // Custom query to get recipes with menu item details for an ingredient
    @Query("SELECT r FROM Recipe r JOIN FETCH r.menuItem WHERE r.ingredient.ingredientId = :ingredientId")
    List<Recipe> findRecipesWithMenuItemsByIngredientId(@Param("ingredientId") Long ingredientId);
}