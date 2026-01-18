package com.smartkitchen.backend.dto;

public class RecipeDTO {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private String menuItemCategory;
    private String menuItemDescription;
    private Long ingredientId;
    private String ingredientName;
    private String ingredientUnit;
    private Double quantityRequired;

    public RecipeDTO() {}

    public RecipeDTO(Long id, Long menuItemId, String menuItemName, String menuItemCategory, 
                     String menuItemDescription, Long ingredientId, String ingredientName, 
                     String ingredientUnit, Double quantityRequired) {
        this.id = id;
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.menuItemCategory = menuItemCategory;
        this.menuItemDescription = menuItemDescription;
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.ingredientUnit = ingredientUnit;
        this.quantityRequired = quantityRequired;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

    public String getMenuItemName() { return menuItemName; }
    public void setMenuItemName(String menuItemName) { this.menuItemName = menuItemName; }

    public String getMenuItemCategory() { return menuItemCategory; }
    public void setMenuItemCategory(String menuItemCategory) { this.menuItemCategory = menuItemCategory; }

    public String getMenuItemDescription() { return menuItemDescription; }
    public void setMenuItemDescription(String menuItemDescription) { this.menuItemDescription = menuItemDescription; }

    public Long getIngredientId() { return ingredientId; }
    public void setIngredientId(Long ingredientId) { this.ingredientId = ingredientId; }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }

    public String getIngredientUnit() { return ingredientUnit; }
    public void setIngredientUnit(String ingredientUnit) { this.ingredientUnit = ingredientUnit; }

    public Double getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Double quantityRequired) { this.quantityRequired = quantityRequired; }
}
