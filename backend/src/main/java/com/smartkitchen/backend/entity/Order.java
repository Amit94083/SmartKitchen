package com.smartkitchen.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
        private java.util.List<OrderItem> orderItems = new java.util.ArrayList<>();

        public java.util.List<OrderItem> getOrderItems() { return orderItems; }
        public void setOrderItems(java.util.List<OrderItem> orderItems) { this.orderItems = orderItems; }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_time", nullable = false)
    private LocalDateTime orderTime;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;


    // Address fields copied from User at order time
    @Column(name = "address_label")
    private String addressLabel;

    @Column(name = "address_full")
    private String addressFull;

    @Column(name = "address_apartment")
    private String addressApartment;

    @Column(name = "address_instructions")
    private String addressInstructions;

    public String getAddressLabel() { return addressLabel; }
    public void setAddressLabel(String addressLabel) { this.addressLabel = addressLabel; }
    public String getAddressFull() { return addressFull; }
    public void setAddressFull(String addressFull) { this.addressFull = addressFull; }
    public String getAddressApartment() { return addressApartment; }
    public void setAddressApartment(String addressApartment) { this.addressApartment = addressApartment; }
    public String getAddressInstructions() { return addressInstructions; }
    public void setAddressInstructions(String addressInstructions) { this.addressInstructions = addressInstructions; }

    public Order() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
}
