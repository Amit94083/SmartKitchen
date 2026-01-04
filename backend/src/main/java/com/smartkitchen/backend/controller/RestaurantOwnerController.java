package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.RestaurantDto;
import com.smartkitchen.backend.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurant-owner")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantOwnerController {
    
    @Autowired
    private RestaurantService restaurantService;
    
    @GetMapping("/restaurant")
    public ResponseEntity<?> getMyRestaurant(@RequestParam String ownerEmail) {
        try {
            RestaurantDto restaurant = restaurantService.getRestaurantByOwner(ownerEmail);
            if (restaurant != null) {
                return ResponseEntity.ok(restaurant);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No restaurant found for this owner");
                return ResponseEntity.ok(response);
            }
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/restaurant")
    public ResponseEntity<?> createRestaurant(@Valid @RequestBody RestaurantDto restaurantDto, @RequestParam String ownerEmail) {
        try {
            RestaurantDto createdRestaurant = restaurantService.createRestaurant(ownerEmail, restaurantDto);
            return ResponseEntity.ok(createdRestaurant);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/restaurant")
    public ResponseEntity<?> updateRestaurant(@Valid @RequestBody RestaurantDto restaurantDto, @RequestParam String ownerEmail) {
        try {
            RestaurantDto updatedRestaurant = restaurantService.updateRestaurant(ownerEmail, restaurantDto);
            return ResponseEntity.ok(updatedRestaurant);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}