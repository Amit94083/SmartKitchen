package com.smartkitchen.backend.service;

import com.smartkitchen.backend.dto.*;
import com.smartkitchen.backend.entity.Customer;
import com.smartkitchen.backend.repository.CustomerRepository;
import com.smartkitchen.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerAuthService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse signup(CustomerSignupRequest signupRequest) {
        // Check if email already exists
        if (customerRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new customer
        Customer customer = new Customer();
        customer.setName(signupRequest.getName());
        customer.setEmail(signupRequest.getEmail());
        customer.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        customer.setPhone(signupRequest.getPhone());
        
        // Save customer
        Customer savedCustomer = customerRepository.save(customer);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedCustomer.getEmail());
        
        // Return response with customer DTO
        return new AuthResponse(token, null, new CustomerDto(savedCustomer));
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        // Find customer by email
        Customer customer = customerRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Check password
        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(customer.getEmail());
        
        // Return response with customer DTO
        return new AuthResponse(token, null, new CustomerDto(customer));
    }
}