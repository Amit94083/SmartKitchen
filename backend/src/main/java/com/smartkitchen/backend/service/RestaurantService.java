package com.smartkitchen.backend.service;

import com.smartkitchen.backend.dto.RestaurantDto;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.entity.Restaurant;
import com.smartkitchen.backend.repository.UserRepository;
import com.smartkitchen.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    private static final Logger logger = LoggerFactory.getLogger(RestaurantService.class);
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<RestaurantDto> getAllRestaurants() {
        logger.info("Fetching all restaurants");
        return restaurantRepository.findAll()
                .stream()
                .map(RestaurantDto::new)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> getOpenRestaurants() {
        logger.info("Fetching all open restaurants");
        return restaurantRepository.findByIsOpenTrue()
                .stream()
                .map(RestaurantDto::new)
                .collect(Collectors.toList());
    }
    
    
    public List<RestaurantDto> searchRestaurantsByName(String name) {
        logger.info("Searching restaurants by name: {}", name);
        return restaurantRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(RestaurantDto::new)
                .collect(Collectors.toList());
    }
    
    public RestaurantDto getRestaurantByOwner(String ownerEmail) {
        logger.info("Fetching restaurant for owner email: {}", ownerEmail);
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> {
                    logger.error("Owner not found for email: {}", ownerEmail);
                    return new RuntimeException("Owner not found");
                });
        
        // Verify user is a restaurant owner
        if (!owner.isRestaurantOwner()) {
            logger.error("User is not a restaurant owner: {}", ownerEmail);
            throw new RuntimeException("User is not a restaurant owner");
        }
        
        Optional<Restaurant> restaurant = restaurantRepository.findByOwner(owner);
        if (restaurant.isPresent()) {
            return new RestaurantDto(restaurant.get());
        }
        logger.warn("No restaurant found for owner: {}", ownerEmail);
        return null;
    }
    
    public RestaurantDto createRestaurant(String ownerEmail, RestaurantDto restaurantDto) {
        logger.info("Creating restaurant for owner email: {} with data: {}", ownerEmail, restaurantDto.getName());
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> {
                    logger.error("Owner not found for email: {}", ownerEmail);
                    return new RuntimeException("Owner not found");
                });
        
        // Verify user is a restaurant owner
        if (!owner.isRestaurantOwner()) {
            logger.error("User is not a restaurant owner: {}", ownerEmail);
            throw new RuntimeException("User is not a restaurant owner");
        }
        
        // Check if owner already has a restaurant
        Optional<Restaurant> existingRestaurant = restaurantRepository.findByOwner(owner);
        if (existingRestaurant.isPresent()) {
            logger.error("Owner already has a restaurant. Use update instead. Owner: {}", ownerEmail);
            throw new RuntimeException("Owner already has a restaurant. Use update instead.");
        }
        
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantDto.getName());
        restaurant.setDescription(restaurantDto.getDescription());
        restaurant.setAddress(restaurantDto.getAddress());
        restaurant.setPhone(restaurantDto.getPhone());
        restaurant.setImageUrl(restaurantDto.getImageUrl());
        restaurant.setIsOpen(restaurantDto.getIsOpen());
        restaurant.setOwner(owner);
        
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        logger.info("Restaurant created successfully for owner: {} with id: {}", ownerEmail, savedRestaurant.getId());
        return new RestaurantDto(savedRestaurant);
    }
    
    public RestaurantDto updateRestaurant(String ownerEmail, RestaurantDto restaurantDto) {
        logger.info("Updating restaurant for owner email: {} with data: {}", ownerEmail, restaurantDto.getName());
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> {
                    logger.error("Owner not found for email: {}", ownerEmail);
                    return new RuntimeException("Owner not found");
                });
        
        // Verify user is a restaurant owner
        if (!owner.isRestaurantOwner()) {
            logger.error("User is not a restaurant owner: {}", ownerEmail);
            throw new RuntimeException("User is not a restaurant owner");
        }
        
        Restaurant restaurant = restaurantRepository.findByOwner(owner)
                .orElseThrow(() -> {
                    logger.error("Restaurant not found for owner: {}", ownerEmail);
                    return new RuntimeException("Restaurant not found for this owner");
                });
        
        restaurant.setName(restaurantDto.getName());
        restaurant.setDescription(restaurantDto.getDescription());
        restaurant.setAddress(restaurantDto.getAddress());
        restaurant.setPhone(restaurantDto.getPhone());
        restaurant.setImageUrl(restaurantDto.getImageUrl());
        restaurant.setIsOpen(restaurantDto.getIsOpen());
        
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        logger.info("Restaurant updated successfully for owner: {} with id: {}", ownerEmail, savedRestaurant.getId());
        return new RestaurantDto(savedRestaurant);
    }
}