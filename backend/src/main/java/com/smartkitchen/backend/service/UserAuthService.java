package com.smartkitchen.backend.service;

import com.smartkitchen.backend.dto.*;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.entity.Restaurant;
import com.smartkitchen.backend.repository.UserRepository;
import com.smartkitchen.backend.repository.RestaurantRepository;
import com.smartkitchen.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    public AuthResponse signup(UserSignupRequest signupRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }
        
        // Validate user type
        User.UserType userType;
        try {
            userType = User.UserType.valueOf(signupRequest.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user type. Must be CUSTOMER or RESTAURANT_OWNER");
        }
        
        // Validate restaurant name for restaurant owners
        if (userType == User.UserType.RESTAURANT_OWNER && 
            (signupRequest.getRestaurantName() == null || signupRequest.getRestaurantName().trim().isEmpty())) {
            throw new RuntimeException("Restaurant name is required for restaurant owners");
        }
        
        // Create new user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhone(signupRequest.getPhone());
        user.setUserType(userType);
        
        if (userType == User.UserType.RESTAURANT_OWNER) {
            user.setRestaurantName(signupRequest.getRestaurantName());
        }
        
        User savedUser = userRepository.save(user);

        // Automatically create a Restaurant entry for new restaurant owners
        if (userType == User.UserType.RESTAURANT_OWNER) {
            Restaurant restaurant = new Restaurant();
            restaurant.setName(signupRequest.getRestaurantName());
            restaurant.setOwner(savedUser);
            restaurant.setIsOpen(true);
            restaurantRepository.save(restaurant);
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getUserType().toString());
        
        // Create UserDto
        UserDto userDto = new UserDto(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getPhone(),
            savedUser.getUserType().toString(),
            savedUser.getRestaurantName(),
            savedUser.getAddressLabel(),
            savedUser.getAddressFull(),
            savedUser.getAddressApartment(),
            savedUser.getAddressInstructions()
        );
        
        return new AuthResponse(token, userDto, "User registered successfully");
    }
    
    public AuthResponse login(UserLoginRequest loginRequest) {
        // Validate user type
        User.UserType userType;
        try {
            userType = User.UserType.valueOf(loginRequest.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user type. Must be CUSTOMER or RESTAURANT_OWNER");
        }
        
        // Find user by email and user type
        User user = userRepository.findByEmailAndUserType(loginRequest.getEmail(), userType)
            .orElseThrow(() -> new RuntimeException("Invalid credentials or user type"));
        
        // Check password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getUserType().toString());
        
        // Create UserDto
        UserDto userDto = new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getUserType().toString(),
            user.getRestaurantName(),
            user.getAddressLabel(),
            user.getAddressFull(),
            user.getAddressApartment(),
            user.getAddressInstructions()
        );
        
        return new AuthResponse(token, userDto, "Login successful");
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}