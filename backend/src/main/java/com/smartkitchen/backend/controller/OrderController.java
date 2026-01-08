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

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private com.smartkitchen.backend.service.CartService cartService;

    @PostMapping("")
    public ResponseEntity<OrderDto> createOrder(@AuthenticationPrincipal UserDetails userDetails, @RequestBody OrderDto orderDto) {
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
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        User user = userRepository.findByEmail(email).orElseThrow();


        // Create new Order and set fields
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(java.time.LocalDateTime.now());
        order.setStatus("Order Placed");
        order.setTotalAmount(orderDto.getTotalAmount());

        // Use address from request if provided, else fallback to user entity
        order.setAddressLabel(
            (orderDto.getAddressLabel() != null && !orderDto.getAddressLabel().isEmpty()) ?
                orderDto.getAddressLabel() : user.getAddressLabel()
        );
        order.setAddressFull(
            (orderDto.getAddressFull() != null && !orderDto.getAddressFull().isEmpty()) ?
                orderDto.getAddressFull() : user.getAddressFull()
        );
        order.setAddressApartment(
            (orderDto.getAddressApartment() != null && !orderDto.getAddressApartment().isEmpty()) ?
                orderDto.getAddressApartment() : user.getAddressApartment()
        );
        order.setAddressInstructions(
            (orderDto.getAddressInstructions() != null && !orderDto.getAddressInstructions().isEmpty()) ?
                orderDto.getAddressInstructions() : user.getAddressInstructions()
        );

        // Set order items if provided (expand as needed)
        if (orderDto.getOrderItems() != null) {
            java.util.List<OrderItem> items = orderDto.getOrderItems().stream().map(dto -> {
                OrderItem item = new OrderItem();
                item.setProductName(dto.getProductName());
                item.setQuantity(dto.getQuantity());
                item.setPrice(dto.getPrice());
                item.setOrder(order);
                return item;
            }).collect(java.util.stream.Collectors.toList());
            order.setOrderItems(items);
        }

        Order saved = orderRepository.save(order);

        // Clear the user's cart after placing the order
        cartService.clearCart(user.getId());

        // Build response DTO
        java.util.List<OrderItemDto> itemDtos = saved.getOrderItems().stream().map(item ->
            new OrderItemDto(
                item.getId(),
                item.getProductName(),
                item.getQuantity(),
                item.getPrice()
            )
        ).collect(java.util.stream.Collectors.toList());
        OrderDto responseDto = new OrderDto(
            saved.getId(),
            saved.getOrderTime(),
            saved.getStatus(),
            saved.getTotalAmount(),
            itemDtos,
            saved.getAddressLabel(),
            saved.getAddressFull(),
            saved.getAddressApartment(),
            saved.getAddressInstructions()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
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
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(404).build();
        }
        java.util.List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item ->
            new OrderItemDto(
                item.getId(),
                item.getProductName(),
                item.getQuantity(),
                item.getPrice()
            )
        ).collect(java.util.stream.Collectors.toList());
        OrderDto responseDto = new OrderDto(
            order.getId(),
            order.getOrderTime(),
            order.getStatus(),
            order.getTotalAmount(),
            itemDtos,
            order.getAddressLabel(),
            order.getAddressFull(),
            order.getAddressApartment(),
            order.getAddressInstructions()
        );
        return ResponseEntity.ok(responseDto);
    }

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
                itemDtos,
                o.getAddressLabel(),
                o.getAddressFull(),
                o.getAddressApartment(),
                o.getAddressInstructions()
            );
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
