package com.smartkitchen.backend.dto;

public class AuthResponse {
    
    private String token;
    private OwnerDto owner;
    private CustomerDto customer;
    
    
    public AuthResponse() {}
    
    
    public AuthResponse(String token, OwnerDto owner) {
        this.token = token;
        this.owner = owner;
        this.customer = null;
    }
    
   
    public AuthResponse(String token, OwnerDto owner, CustomerDto customer) {
        this.token = token;
        this.owner = owner;
        this.customer = customer;
    }
    
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public OwnerDto getOwner() {
        return owner;
    }
    
    public void setOwner(OwnerDto owner) {
        this.owner = owner;
    }
    
    public CustomerDto getCustomer() {
        return customer;
    }
    
    public void setCustomer(CustomerDto customer) {
        this.customer = customer;
    }
}