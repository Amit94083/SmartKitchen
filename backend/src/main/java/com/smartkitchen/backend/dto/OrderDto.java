package com.smartkitchen.backend.dto;

import java.time.LocalDateTime;

import java.util.List;

public class OrderDto {
    private Long id;
    private LocalDateTime orderTime;
    private String status;
    private Double totalAmount;
    private List<OrderItemDto> orderItems;

    public OrderDto() {}

    public OrderDto(Long id, LocalDateTime orderTime, String status, Double totalAmount, List<OrderItemDto> orderItems) {
        this.id = id;
        this.orderTime = orderTime;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderItems = orderItems;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public List<OrderItemDto> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDto> orderItems) { this.orderItems = orderItems; }
}
