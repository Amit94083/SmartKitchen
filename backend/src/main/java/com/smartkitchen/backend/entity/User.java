package com.smartkitchen.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

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
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @CreationTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Enum for user types
    public enum UserType {
        CUSTOMER, RESTAURANT_OWNER
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
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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