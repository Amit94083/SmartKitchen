package com.smartkitchen.backend.dto;

public class AuthResponse {
    
    private String token;
    private UserDto user;
    private String message;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
        this.message = "Authentication successful";
    }
    
    public AuthResponse(String token, UserDto user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}