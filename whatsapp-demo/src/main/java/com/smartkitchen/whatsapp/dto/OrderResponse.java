package com.smartkitchen.whatsapp.dto;

import java.util.Map;

public class OrderResponse {
    private boolean success;
    private String message;
    private Map<String, Integer> deductedIngredients;
    private String error;
    
    public OrderResponse() {}
    
    public OrderResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public OrderResponse(boolean success, String message, Map<String, Integer> deductedIngredients) {
        this.success = success;
        this.message = message;
        this.deductedIngredients = deductedIngredients;
    }
    
    public static OrderResponse error(String error) {
        OrderResponse response = new OrderResponse();
        response.setSuccess(false);
        response.setError(error);
        return response;
    }
    
    public static OrderResponse success(String message, Map<String, Integer> deductedIngredients) {
        return new OrderResponse(true, message, deductedIngredients);
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Map<String, Integer> getDeductedIngredients() {
        return deductedIngredients;
    }
    
    public void setDeductedIngredients(Map<String, Integer> deductedIngredients) {
        this.deductedIngredients = deductedIngredients;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}