package com.smartkitchen.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_messages")
public class SupplierMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "supplier_id")
    private Long supplierId;
    
    @NotBlank(message = "Ingredient name is required")
    @Size(max = 255)
    @Column(name = "ingredient_name", nullable = false)
    private String ingredientName;
    
    @NotBlank(message = "Ingredient type is required")
    @Size(max = 100)
    @Column(name = "ingredient_type", nullable = false)
    private String ingredientType;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;
    
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        lastModifiedAt = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedAt = LocalDateTime.now();
    }
    
    // Constructors
    public SupplierMessage() {}
    
    public SupplierMessage(Long supplierId, String ingredientName, String ingredientType) {
        this.supplierId = supplierId;
        this.ingredientName = ingredientName;
        this.ingredientType = ingredientType;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getSupplierId() {
        return supplierId;
    }
    
    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }
    
    public String getIngredientName() {
        return ingredientName;
    }
    
    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }
    
    public String getIngredientType() {
        return ingredientType;
    }
    
    public void setIngredientType(String ingredientType) {
        this.ingredientType = ingredientType;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastModifiedAt() {
        return lastModifiedAt;
    }
    
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) {
        this.lastModifiedAt = lastModifiedAt;
    }
}
