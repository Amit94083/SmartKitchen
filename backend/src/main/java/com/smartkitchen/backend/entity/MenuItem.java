package com.smartkitchen.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
// If you have a list of CartItems in MenuItem, add this:
    // @OneToMany(mappedBy = "menuItem")
    // @JsonBackReference
    // private List<CartItem> cartItems;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Boolean isVeg;
    private Integer prepTimeX;
    private Integer packTimeY;
    private Integer deliveryTimeZ;
    private String imageUrl;
    private Boolean isAvailable;
    private Long createdByOwnerId;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public MenuItem() {}

    public MenuItem(String name, String description, BigDecimal price, String category, Boolean isVeg, Integer prepTimeX, Integer packTimeY, Integer deliveryTimeZ, String imageUrl, Boolean isAvailable, Long createdByOwnerId) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.isVeg = isVeg;
        this.prepTimeX = prepTimeX;
        this.packTimeY = packTimeY;
        this.deliveryTimeZ = deliveryTimeZ;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
        this.createdByOwnerId = createdByOwnerId;
    }

    // Getters and setters
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }

    public Integer getPrepTimeX() { return prepTimeX; }
    public void setPrepTimeX(Integer prepTimeX) { this.prepTimeX = prepTimeX; }

    public Integer getPackTimeY() { return packTimeY; }
    public void setPackTimeY(Integer packTimeY) { this.packTimeY = packTimeY; }

    public Integer getDeliveryTimeZ() { return deliveryTimeZ; }
    public void setDeliveryTimeZ(Integer deliveryTimeZ) { this.deliveryTimeZ = deliveryTimeZ; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Long getCreatedByOwnerId() { return createdByOwnerId; }
    public void setCreatedByOwnerId(Long createdByOwnerId) { this.createdByOwnerId = createdByOwnerId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
