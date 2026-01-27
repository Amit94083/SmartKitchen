package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.OrderDto;
import com.smartkitchen.backend.dto.OrderItemDto;
import com.smartkitchen.backend.entity.MenuItem;
import com.smartkitchen.backend.entity.Order;
import com.smartkitchen.backend.entity.User;
import com.smartkitchen.backend.entity.Recipe;
import com.smartkitchen.backend.entity.Ingredient;
import com.smartkitchen.backend.repository.OrderRepository;
import com.smartkitchen.backend.repository.UserRepository;
import com.smartkitchen.backend.repository.RecipeRepository;
import com.smartkitchen.backend.repository.IngredientRepository;
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
        order.setStatus(statusUpdateRequest.getStatus());
        orderRepository.save(order);
        return ResponseEntity.ok().body("Order status updated successfully");
    }

    /**
     * Accept order and deduct ingredients from inventory
     * PUT /api/orders/{id}/accept-with-inventory
     */
    @PutMapping("/{id}/accept-with-inventory")
    @Transactional
    public ResponseEntity<?> acceptOrderWithInventory(@PathVariable Long id) {
        logger.info("PUT /api/orders/{}/accept-with-inventory called", id);
        try {
            Order order = orderRepository.findById(id).orElse(null);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
            
            // Check if ingredients are available and deduct them
            boolean ingredientsDeducted = deductIngredientsForOrder(order);
            if (!ingredientsDeducted) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient ingredients to fulfill order");
            }
            
            // Update order status to accepted
            order.setStatus("accepted");
            orderRepository.save(order);
            
            logger.info("Order {} accepted successfully and ingredients deducted", id);
            return ResponseEntity.ok().body("Order accepted and ingredients deducted successfully");
        } catch (Exception e) {
            logger.error("Error accepting order with inventory: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process order: " + e.getMessage());
        }
    }

    /**
     * Helper method to deduct ingredients from inventory based on order items
     */
    private boolean deductIngredientsForOrder(Order order) {
        try {
            logger.info("Starting ingredient deduction for order: {}", order.getId());
            logger.info("Order has {} items", order.getOrderItems().size());
            
            // First pass: Check if all required ingredients are available
            for (OrderItem orderItem : order.getOrderItems()) {
                logger.info("Processing order item: {} (quantity: {})", orderItem.getProductName(), orderItem.getQuantity());
                
                MenuItem menuItem = orderItem.getMenuItem();
                if (menuItem == null) {
                    logger.warn("Menu item not found for order item: {}", orderItem.getProductName());
                    continue;
                }
                
                logger.info("Found menu item: {} (ID: {})", menuItem.getName(), menuItem.getItemId());

                // Get recipes for this menu item
                List<Recipe> recipes = recipeRepository.findByMenuItemItemId(menuItem.getItemId());
                logger.info("Found {} recipes for menu item: {}", recipes.size(), menuItem.getName());
                
                if (recipes.isEmpty()) {
                    logger.warn("No recipes found for menu item: {} (ID: {})", menuItem.getName(), menuItem.getItemId());
                    continue;
                }
                
                for (Recipe recipe : recipes) {
                    Ingredient ingredient = recipe.getIngredient();
                    double requiredQuantity = recipe.getQuantityRequired() * orderItem.getQuantity();
                    
                    logger.info("Recipe requires {} {} of {}, available: {}", 
                        requiredQuantity, ingredient.getUnit(), ingredient.getName(), ingredient.getCurrentQuantity());
                    
                    if (ingredient.getCurrentQuantity() < requiredQuantity) {
                        logger.warn("Insufficient ingredient: {} required: {}, available: {}", 
                            ingredient.getName(), requiredQuantity, ingredient.getCurrentQuantity());
                        return false;
                    }
                }
            }

            // Second pass: Actually deduct the ingredients
            logger.info("All ingredients available, proceeding with deduction");
            for (OrderItem orderItem : order.getOrderItems()) {
                MenuItem menuItem = orderItem.getMenuItem();
                if (menuItem == null) continue;

                List<Recipe> recipes = recipeRepository.findByMenuItemItemId(menuItem.getItemId());
                for (Recipe recipe : recipes) {
                    Ingredient ingredient = recipe.getIngredient();
                    double requiredQuantity = recipe.getQuantityRequired() * orderItem.getQuantity();
                    
                    double previousQuantity = ingredient.getCurrentQuantity();
                    
                    logger.info("Before deduction - Ingredient ID: {}, Name: {}, Current Quantity: {}, Required: {}", 
                        ingredient.getIngredientId(), ingredient.getName(), ingredient.getCurrentQuantity(), requiredQuantity);
                    
                    // Deduct from current quantity
                    ingredient.setCurrentQuantity(ingredient.getCurrentQuantity() - requiredQuantity);
                    ingredient.setLastModifiedAt(java.time.LocalDateTime.now());
                    
                    // Save the updated ingredient
                    Ingredient savedIngredient = ingredientRepository.save(ingredient);
                    
                    // Force flush to database
                    entityManager.flush();
                    
                    logger.info("After save and flush - Ingredient ID: {}, Name: {}, New Quantity: {}", 
                        savedIngredient.getIngredientId(), savedIngredient.getName(), savedIngredient.getCurrentQuantity());
                    
                    // Clear entity manager cache and reload from database
                    entityManager.clear();
                    Ingredient reloadedIngredient = ingredientRepository.findById(ingredient.getIngredientId()).orElse(null);
                    if (reloadedIngredient != null) {
                        logger.info("Verification from database - Ingredient {}: Previous={}, New={}, Database={})", 
                            reloadedIngredient.getName(), previousQuantity, ingredient.getCurrentQuantity(), reloadedIngredient.getCurrentQuantity());
                    } else {
                        logger.error("Could not reload ingredient with ID: {}", ingredient.getIngredientId());
                    }
                }
            }
            
            logger.info("Ingredient deduction completed successfully for order: {}", order.getId());
            return true;
        } catch (Exception e) {
            logger.error("Error deducting ingredients: ", e);
            return false;
        }
    }

    // DTO for status update
    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
