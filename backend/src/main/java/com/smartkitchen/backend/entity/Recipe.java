package com.smartkitchen.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private MenuItem menuItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Column(nullable = false)
    private Double quantityRequired;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
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

    // Default constructor
    public Recipe() {}

    // Constructor with parameters
    public Recipe(MenuItem menuItem, Ingredient ingredient, Double quantityRequired) {
        this.menuItem = menuItem;
        this.ingredient = ingredient;
        this.quantityRequired = quantityRequired;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    public Ingredient getIngredient() { return ingredient; }
    public void setIngredient(Ingredient ingredient) { this.ingredient = ingredient; }

    public Double getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Double quantityRequired) { this.quantityRequired = quantityRequired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastModifiedAt() { return lastModifiedAt; }
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) { this.lastModifiedAt = lastModifiedAt; }
}