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
import java.util.List;

@RestController
@RequestMapping("/api/user/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
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
        return ResponseEntity.ok(userDto);
    }

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
                                user.getAddressInstructions(),
                                user.getIsActive(),
                                user.getCreatedAt()
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
                user.getAddressInstructions(),
                user.getIsActive(),
                user.getCreatedAt()
            );
            return ResponseEntity.ok(userDto);
        }

        @GetMapping("/by-type")
        public ResponseEntity<List<UserDto>> getUsersByType(@RequestParam String userType) {
            try {
                User.UserType type = User.UserType.valueOf(userType.toUpperCase());
                List<User> users = userRepository.findByUserType(type);
                List<UserDto> userDtos = users.stream()
                    .map(user -> new UserDto(
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
                    ))
                    .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(userDtos);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        @PutMapping("/{userId}/status")
        public ResponseEntity<UserDto> updateUserStatus(@PathVariable Long userId, @RequestBody java.util.Map<String, Boolean> request) {
            try {
                Boolean isActive = request.get("isActive");
                if (isActive == null) {
                    return ResponseEntity.badRequest().build();
                }
                
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                    
                user.setIsActive(isActive);
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
                    user.getAddressInstructions(),
                    user.getIsActive(),
                    user.getCreatedAt()
                );
                
                return ResponseEntity.ok(userDto);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }
}