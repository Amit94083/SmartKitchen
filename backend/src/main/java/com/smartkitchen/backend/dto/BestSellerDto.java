package com.smartkitchen.backend.dto;

public class BestSellerDto {
    private String productName;
    private Long totalSold;
    private Double totalRevenue;

    public BestSellerDto(String productName, Long totalSold, Double totalRevenue) {
        this.productName = productName;
        this.totalSold = totalSold;
        this.totalRevenue = totalRevenue;
    }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getTotalSold() { return totalSold; }
    public void setTotalSold(Long totalSold) { this.totalSold = totalSold; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
}
