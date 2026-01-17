package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.OrderDto;
import com.smartkitchen.backend.dto.OrderItemDto;
import com.smartkitchen.backend.entity.Order;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.repository.OrderRepository;
import com.smartkitchen.backend.repository.UserRepository;
import com.smartkitchen.backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private com.smartkitchen.backend.service.CartService cartService;

    // GET /api/orders - Return all orders (for admin or general listing)
    @GetMapping("")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        logger.info("GET /api/orders called");
        List<Order> orders = orderRepository.findAll();
        List<OrderDto> dtos = orders.stream().map(o -> {
            List<OrderItemDto> itemDtos = o.getOrderItems().stream().map(item ->
                new OrderItemDto(
                    item.getId(),
                    item.getProductName(),
                    item.getQuantity(),
                    item.getPrice()
                )
            ).collect(Collectors.toList());
            String customerName = o.getUser() != null ? o.getUser().getName() : "";
            return new OrderDto(
                o.getId(),
                o.getOrderTime(),
                o.getStatus(),
                o.getTotalAmount(),
                itemDtos,
                o.getAddressLabel(),
                o.getAddressFull(),
                o.getAddressApartment(),
                o.getAddressInstructions(),
                customerName
            );
        }).collect(Collectors.toList());
        logger.info("GET /api/orders response: {}", dtos);
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("")
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto) {
        logger.info("POST /api/orders called with payload: {}", orderDto);
        try {
            if (orderDto.getUserId() == null) {
                logger.error("User ID is required");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
            }
            logger.info("Looking for user with ID: {}", orderDto.getUserId());
            User user = userRepository.findById(orderDto.getUserId()).orElse(null);
            if (user == null) {
                logger.error("User not found for ID: {}", orderDto.getUserId());
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }
            logger.info("Found user: {}", user.getId());


        // Create new Order and set fields
        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(java.time.LocalDateTime.now());
        order.setStatus("Pending");
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
        logger.info("POST /api/orders response: {}", responseDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            logger.error("Error processing order: ", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        logger.info("GET /api/orders/{} called", id);
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
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
        logger.info("GET /api/orders/{} response: {}", id, responseDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/my/{userId}")
    public ResponseEntity<List<OrderDto>> getMyOrders(@PathVariable Long userId) {
        logger.info("GET /api/orders/my/{} called", userId);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).build();
        }
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
        logger.info("GET /api/orders/my/{} response: {}", userId, dtos);
        return ResponseEntity.ok(dtos);
    }
}
