package com.smartkitchen.whatsapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class Inventory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "bread_slices")
    private Integer breadSlices = 0;
    
    @Column(name = "lettuce")
    private Integer lettuce = 0;
    
    @Column(name = "tomatoes")
    private Integer tomatoes = 0;
    
    @Column(name = "onions")
    private Integer onions = 0;
    
    @Column(name = "cheese_slices")
    private Integer cheeseSlices = 0;
    
    @Column(name = "mayonnaise")
    private Integer mayonnaise = 0;
    
    @Column(name = "aloo_tikki")
    private Integer alooTikki = 0;
    
    @Column(name = "mint_chutney")
    private Integer mintChutney = 0;
    
    @Column(name = "tamarind_chutney")
    private Integer tamarindChutney = 0;
    
    @Column(name = "pickles")
    private Integer pickles = 0;
    
    @Column(name = "butter")
    private Integer butter = 0;
    
    public Inventory() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
}