package com.smartkitchen.backend.service;

import com.smartkitchen.backend.dto.RestaurantDto;
import com.smartkitchen.backend.entity.Owner;
import com.smartkitchen.backend.entity.Restaurant;
import com.smartkitchen.backend.repository.OwnerRepository;
import com.smartkitchen.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    public List<RestaurantDto> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(RestaurantDto::new)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> getOpenRestaurants() {
        return restaurantRepository.findByIsOpenTrue()
                .stream()
                .map(RestaurantDto::new)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> getRestaurantsByCuisine(String cuisineType) {
        return restaurantRepository.findByCuisineTypeIgnoreCase(cuisineType)
                .stream()
                .map(RestaurantDto::new)
                .collect(Collectors.toList());
    }
    
    public List<RestaurantDto> searchRestaurantsByName(String name) {
        return restaurantRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(RestaurantDto::new)
                .collect(Collectors.toList());
    }
    
    public RestaurantDto getRestaurantByOwner(String ownerEmail) {
        Owner owner = ownerRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        Optional<Restaurant> restaurant = restaurantRepository.findByOwner(owner);
        if (restaurant.isPresent()) {
            return new RestaurantDto(restaurant.get());
        }
        return null;
    }
    
    public RestaurantDto createRestaurant(String ownerEmail, RestaurantDto restaurantDto) {
        Owner owner = ownerRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantDto.getName());
        restaurant.setDescription(restaurantDto.getDescription());
        restaurant.setAddress(restaurantDto.getAddress());
        restaurant.setPhone(restaurantDto.getPhone());
        restaurant.setCuisineType(restaurantDto.getCuisineType());
        restaurant.setImageUrl(restaurantDto.getImageUrl());
        restaurant.setIsOpen(restaurantDto.getIsOpen());
        restaurant.setOwner(owner);
        
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return new RestaurantDto(savedRestaurant);
    }
    
    public RestaurantDto updateRestaurant(String ownerEmail, RestaurantDto restaurantDto) {
        Owner owner = ownerRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        Restaurant restaurant = restaurantRepository.findByOwner(owner)
                .orElseThrow(() -> new RuntimeException("Restaurant not found for this owner"));
        
        restaurant.setName(restaurantDto.getName());
        restaurant.setDescription(restaurantDto.getDescription());
        restaurant.setAddress(restaurantDto.getAddress());
        restaurant.setPhone(restaurantDto.getPhone());
        restaurant.setCuisineType(restaurantDto.getCuisineType());
        restaurant.setImageUrl(restaurantDto.getImageUrl());
        restaurant.setIsOpen(restaurantDto.getIsOpen());
        
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return new RestaurantDto(savedRestaurant);
    }
}