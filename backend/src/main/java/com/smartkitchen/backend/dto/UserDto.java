package com.smartkitchen.backend.dto;

public class UserDto {
    
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String userType;
    private String restaurantName; // Only for restaurant owners
    
    public UserDto() {}
    
    public UserDto(Long id, String name, String email, String phone, String userType, String restaurantName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.userType = userType;
        this.restaurantName = restaurantName;
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
}