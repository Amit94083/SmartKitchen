package com.smartkitchen.whatsapp.dto;

import java.util.List;

public class OrderRequest {
    private List<OrderItem> items;
    
    public OrderRequest() {}
    
    public List<OrderItem> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
    
    public static class OrderItem {
        private String dishName;
        private Integer quantity;
        
        public OrderItem() {}
        
        public OrderItem(String dishName, Integer quantity) {
            this.dishName = dishName;
            this.quantity = quantity;
        }
        
        public String getDishName() {
            return dishName;
        }
        
        public void setDishName(String dishName) {
            this.dishName = dishName;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}