package com.smartkitchen.backend.dto;

public class IngredientDto {
    private Long ingredientId;
    private String name;
    private String ingredientType;
    private String unit;
    private Double currentQuantity;
    private Double maxQuantity;
    private Double thresholdQuantity;
    private Boolean isActive;

    // Getters and setters
    public Long getIngredientId() { return ingredientId; }
    public void setIngredientId(Long ingredientId) { this.ingredientId = ingredientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIngredientType() { return ingredientType; }
    public void setIngredientType(String ingredientType) { this.ingredientType = ingredientType; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getCurrentQuantity() { return currentQuantity; }
    public void setCurrentQuantity(Double currentQuantity) { this.currentQuantity = currentQuantity; }

    public Double getMaxQuantity() { return maxQuantity; }
    public void setMaxQuantity(Double maxQuantity) { this.maxQuantity = maxQuantity; }

    public Double getThresholdQuantity() { return thresholdQuantity; }
    public void setThresholdQuantity(Double thresholdQuantity) { this.thresholdQuantity = thresholdQuantity; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}