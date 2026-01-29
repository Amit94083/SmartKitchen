package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.OrderDto;
import com.smartkitchen.backend.dto.OrderItemDto;
import com.smartkitchen.backend.entity.MenuItem;
import com.smartkitchen.backend.entity.Order;
import com.smartkitchen.backend.entity.OrderStatus;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.entity.Recipe;
import com.smartkitchen.backend.entity.Ingredient;
import com.smartkitchen.backend.repository.OrderRepository;
import com.smartkitchen.backend.repository.UserRepository;
import com.smartkitchen.backend.repository.RecipeRepository;
import com.smartkitchen.backend.repository.IngredientRepository;
import com.smartkitchen.backend.repository.MenuItemRepository;
import com.smartkitchen.backend.repository.OrderItemRepository;
import com.smartkitchen.backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

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
    private RecipeRepository recipeRepository;
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
        /**
         * Update inventory for an order by deducting ingredient quantities based on recipes
         * POST /api/orders/{orderId}/update-inventory
         */
        @PostMapping("/{orderId}/update-inventory")
        @Transactional
        public ResponseEntity<?> updateInventoryForOrder(@PathVariable Long orderId) {
            logger.info("POST /api/orders/{}/update-inventory called", orderId);
            Order order = orderRepository.findByIdWithUser(orderId).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
            List<OrderItem> orderItems = order.getOrderItems();
            if (orderItems == null || orderItems.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No items in order");
            }
            for (OrderItem orderItem : orderItems) {
                MenuItem menuItem = orderItem.getMenuItem();
                if (menuItem == null) {
                    logger.warn("OrderItem {} has no menuItem, skipping", orderItem.getId());
                    continue;
                }
                List<Recipe> recipes = recipeRepository.findByMenuItem(menuItem);
                for (Recipe recipe : recipes) {
                    Ingredient ingredient = recipe.getIngredient();
                    if (ingredient == null) {
                        logger.warn("Recipe {} has no ingredient, skipping", recipe.getId());
                        continue;
                    }
                    double totalToDeduct = recipe.getQuantityRequired() * orderItem.getQuantity();
                    double newQty = ingredient.getCurrentQuantity() - totalToDeduct;
                    if (newQty < 0) {
                        logger.warn("Ingredient {} would go negative. Setting to 0.", ingredient.getIngredientId());
                        newQty = 0;
                    }
                    ingredient.setCurrentQuantity(newQty);
                    ingredientRepository.save(ingredient);
                    logger.info("Deducted {} from ingredient {} for order {}", totalToDeduct, ingredient.getIngredientId(), orderId);
                }
            }
            return ResponseEntity.ok().body("Inventory updated for order " + orderId);
        }
    @Autowired
    private com.smartkitchen.backend.service.CartService cartService;
    @PersistenceContext
    private EntityManager entityManager;

    // GET /api/orders - Return all orders (for admin or general listing)
    @GetMapping("")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        logger.info("GET /api/orders called");
        List<Order> orders = orderRepository.findAllWithUser();
        List<OrderDto> dtos = orders.stream().map(o -> {
            List<OrderItemDto> itemDtos = o.getOrderItems().stream().map(item -> {
                MenuItem menuItem = item.getMenuItem();
                return new OrderItemDto(
                    item.getId(),
                    item.getProductName(),
                    item.getQuantity(),
                    item.getPrice(),
                    menuItem != null ? menuItem.getName() : item.getProductName(),
                    menuItem != null ? menuItem.getDescription() : "",
                    menuItem != null ? menuItem.getCategory() : "",
                    menuItem != null ? menuItem.getImageUrl() : "",
                    menuItem != null ? menuItem.getIsVeg() : null
                );
            }).collect(Collectors.toList());
            String customerName = o.getUser() != null ? o.getUser().getName() : "";
            String customerPhone = o.getUser() != null ? o.getUser().getPhone() : "";
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
                customerName,
                customerPhone
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
        order.setStatus(OrderStatus.Placed);
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
                if (dto.getMenuItemId() != null) {
                    menuItemRepository.findById(dto.getMenuItemId()).ifPresent(item::setMenuItem);
                }
                return item;
            }).collect(java.util.stream.Collectors.toList());
            order.setOrderItems(items);
        }

        Order saved = orderRepository.save(order);

        // Clear the user's cart after placing the order
        cartService.clearCart(user.getId());

        // Build response DTO
        java.util.List<OrderItemDto> itemDtos = saved.getOrderItems().stream().map(item -> {
            MenuItem menuItem = item.getMenuItem();
            return new OrderItemDto(
                item.getId(),
                item.getProductName(),
                item.getQuantity(),
                item.getPrice(),
                menuItem != null ? menuItem.getName() : item.getProductName(),
                menuItem != null ? menuItem.getDescription() : "",
                menuItem != null ? menuItem.getCategory() : "",
                menuItem != null ? menuItem.getImageUrl() : "",
                menuItem != null ? menuItem.getIsVeg() : null
            );
        }).collect(java.util.stream.Collectors.toList());
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
        Order order = orderRepository.findByIdWithUser(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).build();
        }
        java.util.List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item -> {
            MenuItem menuItem = item.getMenuItem();
            return new OrderItemDto(
                item.getId(),
                item.getProductName(),
                item.getQuantity(),
                item.getPrice(),
                menuItem != null ? menuItem.getName() : item.getProductName(),
                menuItem != null ? menuItem.getDescription() : "",
                menuItem != null ? menuItem.getCategory() : "",
                menuItem != null ? menuItem.getImageUrl() : "",
                menuItem != null ? menuItem.getIsVeg() : null
            );
        }).collect(java.util.stream.Collectors.toList());
        String customerName = order.getUser() != null ? order.getUser().getName() : "";
        String customerPhone = order.getUser() != null ? order.getUser().getPhone() : "";
        OrderDto responseDto = new OrderDto(
            order.getId(),
            order.getOrderTime(),
            order.getStatus(),
            order.getTotalAmount(),
            itemDtos,
            order.getAddressLabel(),
            order.getAddressFull(),
            order.getAddressApartment(),
            order.getAddressInstructions(),
            customerName,
            customerPhone
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
        List<Order> orders = orderRepository.findByUserWithUser(user);
        List<OrderDto> dtos = orders.stream().map(o -> {
            java.util.List<OrderItemDto> itemDtos = o.getOrderItems().stream().map(item -> {
                MenuItem menuItem = item.getMenuItem();
                return new OrderItemDto(
                    item.getId(),
                    item.getProductName(),
                    item.getQuantity(),
                    item.getPrice(),
                    menuItem != null ? menuItem.getName() : item.getProductName(),
                    menuItem != null ? menuItem.getDescription() : "",
                    menuItem != null ? menuItem.getCategory() : "",
                    menuItem != null ? menuItem.getImageUrl() : "",
                    menuItem != null ? menuItem.getIsVeg() : null
                );
            }).collect(java.util.stream.Collectors.toList());
            String customerName = o.getUser() != null ? o.getUser().getName() : "";
            String customerPhone = o.getUser() != null ? o.getUser().getPhone() : "";
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
                customerName,
                customerPhone
            );
        }).collect(Collectors.toList());
        logger.info("GET /api/orders/my/{} response: {}", userId, dtos);
        return ResponseEntity.ok(dtos);
    }
    /**
     * Update the status of an order
     * PUT /api/orders/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest statusUpdateRequest) {
        logger.info("PUT /api/orders/{}/status called with status: {}", id, statusUpdateRequest.getStatus());
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
        try {
            order.setStatus(OrderStatus.valueOf(statusUpdateRequest.getStatus()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
        }
        orderRepository.save(order);
        return ResponseEntity.ok().body("Order status updated successfully");
    }


    // DTO for status update
    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
