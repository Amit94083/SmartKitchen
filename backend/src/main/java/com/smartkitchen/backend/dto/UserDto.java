package com.smartkitchen.backend.dto;

import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String userType;
    private String restaurantName; // Only for restaurant owners
    private LocalDateTime createdAt; // Join date

    // Address fields
    private String addressLabel;
    private String addressFull;
    private String addressApartment;
    private String addressInstructions;

    public UserDto() {}

    public UserDto(Long id, String name, String email, String phone, String userType, String restaurantName,
                   String addressLabel, String addressFull, String addressApartment, String addressInstructions, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.userType = userType;
        this.restaurantName = restaurantName;
        this.addressLabel = addressLabel;
        this.addressFull = addressFull;
        this.addressApartment = addressApartment;
        this.addressInstructions = addressInstructions;
        this.createdAt = createdAt;
    }
        public String getAddressLabel() {
            return addressLabel;
        }
        public void setAddressLabel(String addressLabel) {
            this.addressLabel = addressLabel;
        }
        public String getAddressFull() {
            return addressFull;
        }
        public void setAddressFull(String addressFull) {
            this.addressFull = addressFull;
        }
        public String getAddressApartment() {
            return addressApartment;
        }
        public void setAddressApartment(String addressApartment) {
            this.addressApartment = addressApartment;
        }
        public String getAddressInstructions() {
            return addressInstructions;
        }
        public void setAddressInstructions(String addressInstructions) {
            this.addressInstructions = addressInstructions;
        }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
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
    
    public String getUserType() {
        return userType;
    }
    
    public void setUserType(String userType) {
        this.userType = userType;
    }
    
    public String getRestaurantName() {
        return restaurantName;
    }
    
    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}