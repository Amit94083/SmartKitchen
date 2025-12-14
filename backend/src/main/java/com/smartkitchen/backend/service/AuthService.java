package com.smartkitchen.backend.service;

import com.smartkitchen.backend.dto.*;
import com.smartkitchen.backend.entity.Owner;
import com.smartkitchen.backend.repository.OwnerRepository;
import com.smartkitchen.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse signup(SignupRequest signupRequest) {
        // Check if email already exists
        if (ownerRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new owner
        Owner owner = new Owner();
        owner.setRestaurantName(signupRequest.getRestaurantName());
        owner.setOwnerName(signupRequest.getOwnerName());
        owner.setEmail(signupRequest.getEmail());
        owner.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        owner.setPhone(signupRequest.getPhone());
        
        // Save owner
        Owner savedOwner = ownerRepository.save(owner);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedOwner.getEmail());
        
        // Return response
        return new AuthResponse(token, new OwnerDto(savedOwner));
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        // Find owner by email
        Owner owner = ownerRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Check password
        if (!passwordEncoder.matches(loginRequest.getPassword(), owner.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(owner.getEmail());
        
        // Return response
        return new AuthResponse(token, new OwnerDto(owner));
    }
}