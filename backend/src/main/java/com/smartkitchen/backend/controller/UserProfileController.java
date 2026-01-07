package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.UserDto;
import com.smartkitchen.backend.dto.UserProfileUpdateRequest;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {
    @Autowired
    private UserRepository userRepository;

        @PutMapping
        public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                                                                 @RequestBody UserProfileUpdateRequest request) {
                String email = null;
                if (userDetails != null) {
                        email = userDetails.getUsername();
                } else {
                        // Fallback: get from SecurityContext
                        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                                email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                        } else if (principal instanceof String) {
                                email = (String) principal;
                        }
                }
                if (email == null) {
                        throw new RuntimeException("User is not authenticated");
                }
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                user.setAddressLabel(request.getAddressLabel());
                user.setAddressFull(request.getAddressFull());
                user.setAddressApartment(request.getAddressApartment());
                user.setAddressInstructions(request.getAddressInstructions());
                userRepository.save(user);
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
                return ResponseEntity.ok(userDto);
        }

        @GetMapping("/{userId}")
        public ResponseEntity<UserDto> getProfile(@PathVariable Long userId) {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
            return ResponseEntity.ok(userDto);
        }
}