package com.smartkitchen.backend.dto;

public class OrderItemDto {
    private Long id;
    private Long menuItemId;
        public Long getMenuItemId() { return menuItemId; }
        public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }
    private String productName;
    private Integer quantity;
    private Double price;

    // Menu item details
    private String menuItemName;
    private String menuItemDescription;
    private String menuItemCategory;
    private String menuItemImageUrl;
    private Boolean menuItemIsVeg;

    public OrderItemDto() {}

    public OrderItemDto(Long id, String productName, Integer quantity, Double price) {
        this.id = id;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }

    public OrderItemDto(Long id, String productName, Integer quantity, Double price,
                        String menuItemName, String menuItemDescription, String menuItemCategory,
                        String menuItemImageUrl, Boolean menuItemIsVeg) {
        this.id = id;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.menuItemName = menuItemName;
        this.menuItemDescription = menuItemDescription;
        this.menuItemCategory = menuItemCategory;
        this.menuItemImageUrl = menuItemImageUrl;
        this.menuItemIsVeg = menuItemIsVeg;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }


    public String getMenuItemName() { return menuItemName; }
    public void setMenuItemName(String menuItemName) { this.menuItemName = menuItemName; }

    public String getMenuItemDescription() { return menuItemDescription; }
    public void setMenuItemDescription(String menuItemDescription) { this.menuItemDescription = menuItemDescription; }

    public String getMenuItemCategory() { return menuItemCategory; }
    public void setMenuItemCategory(String menuItemCategory) { this.menuItemCategory = menuItemCategory; }

    public String getMenuItemImageUrl() { return menuItemImageUrl; }
    public void setMenuItemImageUrl(String menuItemImageUrl) { this.menuItemImageUrl = menuItemImageUrl; }

    public Boolean getMenuItemIsVeg() { return menuItemIsVeg; }
    public void setMenuItemIsVeg(Boolean menuItemIsVeg) { this.menuItemIsVeg = menuItemIsVeg; }

    @Override
    public String toString() {
        return "OrderItemDto{" +
                "id=" + id +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                '}';
    }
}
