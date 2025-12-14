package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.RestaurantDto;
import com.smartkitchen.backend.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner/restaurant")
@CrossOrigin(origins = "http://localhost:3000")
public class OwnerRestaurantController {
    
    @Autowired
    private RestaurantService restaurantService;
    
    @GetMapping
    public ResponseEntity<RestaurantDto> getMyRestaurant(@RequestParam String ownerEmail) {
        try {
            RestaurantDto restaurant = restaurantService.getRestaurantByOwner(ownerEmail);
            if (restaurant != null) {
                return ResponseEntity.ok(restaurant);
            } else {
                return ResponseEntity.noContent().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<RestaurantDto> createRestaurant(@Valid @RequestBody RestaurantDto restaurantDto, @RequestParam String ownerEmail) {
        try {
            RestaurantDto createdRestaurant = restaurantService.createRestaurant(ownerEmail, restaurantDto);
            return ResponseEntity.ok(createdRestaurant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping
    public ResponseEntity<RestaurantDto> updateRestaurant(@Valid @RequestBody RestaurantDto restaurantDto, @RequestParam String ownerEmail) {
        try {
            RestaurantDto updatedRestaurant = restaurantService.updateRestaurant(ownerEmail, restaurantDto);
            return ResponseEntity.ok(updatedRestaurant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}