package com.smartkitchen.backend.dto;

import com.smartkitchen.backend.entity.Owner;

import java.time.LocalDateTime;

public class OwnerDto {
    
    private Long id;
    private String restaurantName;
    private String ownerName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    
    // Default constructor
    public OwnerDto() {}
    
    // Constructor from Owner entity
    public OwnerDto(Owner owner) {
        this.id = owner.getId();
        this.restaurantName = owner.getRestaurantName();
        this.ownerName = owner.getOwnerName();
        this.email = owner.getEmail();
        this.phone = owner.getPhone();
        this.createdAt = owner.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getRestaurantName() {
        return restaurantName;
    }
    
    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}