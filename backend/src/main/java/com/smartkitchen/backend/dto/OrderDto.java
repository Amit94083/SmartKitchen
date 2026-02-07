package com.smartkitchen.backend.dto;


import com.smartkitchen.backend.entity.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;



public class OrderDto {
    private Long id;
    private LocalDateTime orderTime;
    private OrderStatus status;
    private Double totalAmount;
    private List<OrderItemDto> orderItems;
    private Long userId;
    private String customerName;
    private String customerPhone;
    private Long deliveryPartnerId;
    private LocalDateTime assignedAt;
    private LocalDateTime deliveredAt;

    // Address fields
    private String addressLabel;
    private String addressFull;
    private String addressApartment;
    private String addressInstructions;

    public OrderDto() {}

    public OrderDto(Long id, LocalDateTime orderTime, OrderStatus status, Double totalAmount, List<OrderItemDto> orderItems,
                    String addressLabel, String addressFull, String addressApartment, String addressInstructions, String customerName, String customerPhone, Long deliveryPartnerId, LocalDateTime assignedAt, LocalDateTime deliveredAt) {
        this.id = id;
        this.orderTime = orderTime;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderItems = orderItems;
        this.addressLabel = addressLabel;
        this.addressFull = addressFull;
        this.addressApartment = addressApartment;
        this.addressInstructions = addressInstructions;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.deliveryPartnerId = deliveryPartnerId;
        this.assignedAt = assignedAt;
        this.deliveredAt = deliveredAt;
    }

    // Constructor without customerName (for POST response in OrderController)
    public OrderDto(Long id, LocalDateTime orderTime, OrderStatus status, Double totalAmount, List<OrderItemDto> orderItems,
                    String addressLabel, String addressFull, String addressApartment, String addressInstructions, LocalDateTime assignedAt, LocalDateTime deliveredAt) {
        this.id = id;
        this.orderTime = orderTime;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderItems = orderItems;
        this.addressLabel = addressLabel;
        this.addressFull = addressFull;
        this.addressApartment = addressApartment;
        this.addressInstructions = addressInstructions;
        this.assignedAt = assignedAt;
        this.deliveredAt = deliveredAt;
    }

    // Constructor without customerName and assignedAt (for legacy compatibility)
    public OrderDto(Long id, LocalDateTime orderTime, OrderStatus status, Double totalAmount, List<OrderItemDto> orderItems,
                    String addressLabel, String addressFull, String addressApartment, String addressInstructions) {
        this.id = id;
        this.orderTime = orderTime;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderItems = orderItems;
        this.addressLabel = addressLabel;
        this.addressFull = addressFull;
        this.addressApartment = addressApartment;
        this.addressInstructions = addressInstructions;
    }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public List<OrderItemDto> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDto> orderItems) { this.orderItems = orderItems; }

    public String getAddressLabel() { return addressLabel; }
    public void setAddressLabel(String addressLabel) { this.addressLabel = addressLabel; }
    public String getAddressFull() { return addressFull; }
    public void setAddressFull(String addressFull) { this.addressFull = addressFull; }
    public String getAddressApartment() { return addressApartment; }
    public void setAddressApartment(String addressApartment) { this.addressApartment = addressApartment; }
    public String getAddressInstructions() { return addressInstructions; }
    public void setAddressInstructions(String addressInstructions) { this.addressInstructions = addressInstructions; }

    public Long getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(Long deliveryPartnerId) { this.deliveryPartnerId = deliveryPartnerId; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    @Override
    public String toString() {
        return "OrderDto{" +
                "id=" + id +
                ", orderTime=" + orderTime +
                ", status=" + status +
                ", totalAmount=" + totalAmount +
                ", orderItems=" + orderItems +
                ", userId=" + userId +
                ", addressLabel='" + addressLabel + '\'' +
                ", addressFull='" + addressFull + '\'' +
                ", addressApartment='" + addressApartment + '\'' +
                ", addressInstructions='" + addressInstructions + '\'' +
                '}';
    }
}
