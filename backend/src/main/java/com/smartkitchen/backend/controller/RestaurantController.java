package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.RestaurantDto;
import com.smartkitchen.backend.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {
    
    @Autowired
    private RestaurantService restaurantService;
    
    @GetMapping
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() {
        List<RestaurantDto> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/open")
    public ResponseEntity<List<RestaurantDto>> getOpenRestaurants() {
        List<RestaurantDto> restaurants = restaurantService.getOpenRestaurants();
        return ResponseEntity.ok(restaurants);
    }
    
    
    @GetMapping("/search")
    public ResponseEntity<List<RestaurantDto>> searchRestaurants(@RequestParam String name) {
        List<RestaurantDto> restaurants = restaurantService.searchRestaurantsByName(name);
        return ResponseEntity.ok(restaurants);
    }
}