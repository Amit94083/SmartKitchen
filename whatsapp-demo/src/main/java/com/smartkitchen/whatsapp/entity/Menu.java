package com.smartkitchen.whatsapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "menu")
public class Menu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dish_name", nullable = false)
    private String dishName;
    
    @Column(name = "bread_slices")
    private Integer breadSlices;
    
    @Column(name = "lettuce")
    private Integer lettuce;
    
    @Column(name = "tomatoes")
    private Integer tomatoes;
    
    @Column(name = "onions")
    private Integer onions;
    
    @Column(name = "cheese_slices")
    private Integer cheeseSlices;
    
    @Column(name = "mayonnaise")
    private Integer mayonnaise;
    
    @Column(name = "aloo_tikki")
    private Integer alooTikki;
    
    @Column(name = "mint_chutney")
    private Integer mintChutney;
    
    @Column(name = "tamarind_chutney")
    private Integer tamarindChutney;
    
    @Column(name = "pickles")
    private Integer pickles;
    
    @Column(name = "butter")
    private Integer butter;
    
    @Column(name = "price")
    private Double price = 0.0;
    
    public Menu() {}
    
    public Menu(String dishName) {
        this.dishName = dishName;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDishName() {
        return dishName;
    }
    
    public void setDishName(String dishName) {
        this.dishName = dishName;
    }
    
    public Integer getBreadSlices() {
        return breadSlices;
    }
    
    public void setBreadSlices(Integer breadSlices) {
        this.breadSlices = breadSlices;
    }
    
    public Integer getLettuce() {
        return lettuce;
    }
    
    public void setLettuce(Integer lettuce) {
        this.lettuce = lettuce;
    }
    
    public Integer getTomatoes() {
        return tomatoes;
    }
    
    public void setTomatoes(Integer tomatoes) {
        this.tomatoes = tomatoes;
    }
    
    public Integer getOnions() {
        return onions;
    }
    
    public void setOnions(Integer onions) {
        this.onions = onions;
    }
    
    public Integer getCheeseSlices() {
        return cheeseSlices;
    }
    
    public void setCheeseSlices(Integer cheeseSlices) {
        this.cheeseSlices = cheeseSlices;
    }
    
    public Integer getMayonnaise() {
        return mayonnaise;
    }
    
    public void setMayonnaise(Integer mayonnaise) {
        this.mayonnaise = mayonnaise;
    }
    
    public Integer getAlooTikki() {
        return alooTikki;
    }
    
    public void setAlooTikki(Integer alooTikki) {
        this.alooTikki = alooTikki;
    }
    
    public Integer getMintChutney() {
        return mintChutney;
    }
    
    public void setMintChutney(Integer mintChutney) {
        this.mintChutney = mintChutney;
    }
    
    public Integer getTamarindChutney() {
        return tamarindChutney;
    }
    
    public void setTamarindChutney(Integer tamarindChutney) {
        this.tamarindChutney = tamarindChutney;
    }
    
    public Integer getPickles() {
        return pickles;
    }
    
    public void setPickles(Integer pickles) {
        this.pickles = pickles;
    }
    
    public Integer getButter() {
        return butter;
    }
    
    public void setButter(Integer butter) {
        this.butter = butter;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
}