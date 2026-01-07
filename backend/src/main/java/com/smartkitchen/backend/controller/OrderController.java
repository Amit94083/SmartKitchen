package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.OrderDto;
import com.smartkitchen.backend.dto.OrderItemDto;
import com.smartkitchen.backend.entity.Order;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.repository.OrderRepository;
import com.smartkitchen.backend.repository.UserRepository;
import com.smartkitchen.backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    // No need for OrderItemRepository, use order.getOrderItems()

    @GetMapping("/my")
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        String email = null;
        if (userDetails != null) {
            email = userDetails.getUsername();
        } else {
            Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                email = (String) principal;
            }
        }
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Order> orders = orderRepository.findByUser(user);
        List<OrderDto> dtos = orders.stream().map(o -> {
            // Map OrderItems to OrderItemDto
            java.util.List<OrderItemDto> itemDtos = o.getOrderItems().stream().map(item ->
                new OrderItemDto(
                    item.getId(),
                    item.getProductName(),
                    item.getQuantity(),
                    item.getPrice()
                )
            ).collect(java.util.stream.Collectors.toList());
            return new OrderDto(
                o.getId(),
                o.getOrderTime(),
                o.getStatus(),
                o.getTotalAmount(),
                itemDtos
            );
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
