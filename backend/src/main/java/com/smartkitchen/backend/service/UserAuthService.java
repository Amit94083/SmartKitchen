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
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }
        
        User.UserType userType;
        try {
            userType = User.UserType.valueOf(signupRequest.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user type. Must be CUSTOMER or RESTAURANT_OWNER");
        }
        
        if (userType == User.UserType.RESTAURANT_OWNER && 
            (signupRequest.getRestaurantName() == null || signupRequest.getRestaurantName().trim().isEmpty())) {
            throw new RuntimeException("Restaurant name is required for restaurant owners");
        }
        
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        
        // Add +91 prefix for supplier phone numbers if not already present
        String phoneNumber = signupRequest.getPhone();
        if (userType == User.UserType.SUPPLIER && phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            phoneNumber = phoneNumber.trim();
            // Remove any existing + or country code
            phoneNumber = phoneNumber.replaceAll("^\\+?91", "");
            // Add +91 prefix
            phoneNumber = "91" + phoneNumber;
        }
        user.setPhone(phoneNumber);
        
        user.setUserType(userType);
        user.setAddressLabel(signupRequest.getAddressLabel());
        user.setAddressFull(signupRequest.getAddressFull());
        user.setAddressApartment(signupRequest.getAddressApartment());
        user.setAddressInstructions(signupRequest.getAddressInstructions());
        
        if (userType == User.UserType.RESTAURANT_OWNER) {
            user.setRestaurantName(signupRequest.getRestaurantName());
        }
        
        User savedUser = userRepository.save(user);

        if (userType == User.UserType.RESTAURANT_OWNER) {
            Restaurant restaurant = new Restaurant();
            restaurant.setName(signupRequest.getRestaurantName());
            restaurant.setOwner(savedUser);
            restaurant.setIsOpen(true);
            restaurantRepository.save(restaurant);
        }

        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getUserType().toString());
        
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
            savedUser.getAddressInstructions(),
            savedUser.getIsActive(),
            savedUser.getCreatedAt()
        );
        
        return new AuthResponse(token, userDto, "User registered successfully");
    }
    
    public AuthResponse login(UserLoginRequest loginRequest) {
        User.UserType userType;
        try {
            userType = User.UserType.valueOf(loginRequest.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user type. Must be CUSTOMER or RESTAURANT_OWNER");
        }
        
        User user = userRepository.findByEmailAndUserType(loginRequest.getEmail(), userType)
            .orElseThrow(() -> new RuntimeException("Invalid credentials or user type"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getUserType().toString());
        
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
            user.getAddressInstructions(),
            user.getIsActive(),
            user.getCreatedAt()
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