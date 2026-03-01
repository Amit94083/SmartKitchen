package com.smartkitchen.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(max = 255)
    @Column(name = "name", nullable = false)
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Size(max = 255)
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(max = 255)
    @Column(name = "password", nullable = false)
    private String password;
    
    @Size(max = 20)
    @Column(name = "phone")
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;
    

    // Additional field for restaurant owners
    @Size(max = 255)
    @Column(name = "restaurant_name")
    private String restaurantName;

    // Address fields for users
    @Size(max = 100)
    @Column(name = "address_label")
    private String addressLabel;

    @Size(max = 500)
    @Column(name = "address_full")
    private String addressFull;

    @Size(max = 100)
    @Column(name = "address_apartment")
    private String addressApartment;

    @Size(max = 255)
    @Column(name = "address_instructions")
    private String addressInstructions;
    
    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        lastModifiedAt = now;
        if (isActive == null) {
            isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        lastModifiedAt = LocalDateTime.now();
    }
    
    // Enum for user types
    public enum UserType {
        CUSTOMER, RESTAURANT_OWNER, DELIVERY_PARTNER, SUPPLIER
    }
    
    // Default constructor
    public User() {}
    
    // Constructor for customers
    public User(String name, String email, String password, String phone) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.userType = UserType.CUSTOMER;
    }
    
    // Constructor for restaurant owners
    public User(String name, String email, String password, String phone, String restaurantName) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.restaurantName = restaurantName;
        this.userType = UserType.RESTAURANT_OWNER;
    }
    
    // Getters and Setters
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
    
    public UserType getUserType() {
        return userType;
    }
    
    public void setUserType(UserType userType) {
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
    
    public LocalDateTime getLastModifiedAt() {
        return lastModifiedAt;
    }
    
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) {
        this.lastModifiedAt = lastModifiedAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    // Helper methods
    public boolean isCustomer() {
        return UserType.CUSTOMER.equals(this.userType);
    }
    
    public boolean isRestaurantOwner() {
        return UserType.RESTAURANT_OWNER.equals(this.userType);
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", userType=" + userType +
                ", restaurantName='" + restaurantName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}