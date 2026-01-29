
package com.smartkitchen.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
            @PrePersist
            protected void onCreate() {
                LocalDateTime now = LocalDateTime.now();
                createdAt = now;
                lastModifiedAt = now;
            }

            @PreUpdate
            protected void onUpdate() {
                lastModifiedAt = LocalDateTime.now();
            }
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;

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

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastModifiedAt() { return lastModifiedAt; }
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) { this.lastModifiedAt = lastModifiedAt; }
}
