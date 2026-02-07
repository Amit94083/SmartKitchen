package com.smartkitchen.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserSignupRequest {
    
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must be less than 255 characters")
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must be less than 255 characters")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 255, message = "Password must be between 6 and 255 characters")
    private String password;
    
    @Size(max = 20, message = "Phone must be less than 20 characters")
    private String phone;
    
    @NotBlank(message = "User type is required")
    private String userType; 
    
    // For restaurant owners
    @Size(max = 255, message = "Restaurant name must be less than 255 characters")
    private String restaurantName;
    
    // Address fields
    private String addressLabel;
    private String addressFull;
    private String addressApartment;
    private String addressInstructions;
    
    public UserSignupRequest() {}
    
    public UserSignupRequest(String name, String email, String password, String phone, String userType, String restaurantName) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.userType = userType;
        this.restaurantName = restaurantName;
    }
    
    // Getters and Setters
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
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
    
    // Address field getters and setters
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
}