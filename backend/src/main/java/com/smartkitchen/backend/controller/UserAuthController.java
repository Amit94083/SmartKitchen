package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.AuthResponse;
import com.smartkitchen.backend.dto.UserLoginRequest;
import com.smartkitchen.backend.dto.UserSignupRequest;
import com.smartkitchen.backend.service.UserAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAuthController {
    
    @Autowired
    private UserAuthService userAuthService;
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserSignupRequest signupRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        
        try {
            AuthResponse authResponse = userAuthService.signup(signupRequest);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        
        try {
            AuthResponse authResponse = userAuthService.login(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}