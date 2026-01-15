package com.smartkitchen.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ingredientId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String ingredientType;

    @Column(nullable = false)
    private String unit; // e.g., kg, liter

    @Column(nullable = false)
    private Double currentQuantity;

    @Column(nullable = false)
    private Double thresholdQuantity;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime lastModify;

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

    public Double getThresholdQuantity() { return thresholdQuantity; }
    public void setThresholdQuantity(Double thresholdQuantity) { this.thresholdQuantity = thresholdQuantity; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastModify() { return lastModify; }
    public void setLastModify(LocalDateTime lastModify) { this.lastModify = lastModify; }
}
