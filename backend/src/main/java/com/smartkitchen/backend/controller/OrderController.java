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
import java.time.LocalDateTime;
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
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.smartkitchen.backend.service.OrderEventService;

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
    @Autowired
    private OrderEventService orderEventService;
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

    /**
     * Establishes a Server-Sent Events (SSE) connection for real-time order updates.
     * Clients connect to this endpoint to receive live order status changes.
     * 
     * @return SseEmitter for streaming order updates
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamOrderUpdates() {
        logger.info("New SSE connection request for order updates");
        return orderEventService.addEmitter();
    }

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
                customerPhone,
                o.getDeliveryPartnerId(),
                o.getAssignedAt(),
                o.getDeliveredAt()
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

        // Broadcast the new order to all connected SSE clients (owner dashboard)
        orderEventService.sendOrderUpdate(saved);
        logger.info("New order creation broadcasted to SSE clients");

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
            saved.getAddressInstructions(),
            saved.getAssignedAt(),
            saved.getDeliveredAt()
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
            customerPhone,
            order.getDeliveryPartnerId(),
            order.getAssignedAt(),
            order.getDeliveredAt()
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
                customerPhone,
                o.getDeliveryPartnerId(),
                o.getAssignedAt(),
                o.getDeliveredAt()
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
            OrderStatus newStatus = OrderStatus.valueOf(statusUpdateRequest.getStatus());
            order.setStatus(newStatus);
            
            // Set delivered_at timestamp when order is marked as delivered
            if (newStatus == OrderStatus.Delivered) {
                order.setDeliveredAt(LocalDateTime.now());
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status value");
        }
        Order updatedOrder = orderRepository.save(order);
        
        // Broadcast the order update to all connected SSE clients
        orderEventService.sendOrderUpdate(updatedOrder);
        logger.info("Order status update broadcasted to SSE clients");
        
        return ResponseEntity.ok().body("Order status updated successfully");
    }

    @PutMapping("/{id}/assign-partner")
    public ResponseEntity<?> assignDeliveryPartner(@PathVariable Long id, @RequestBody AssignPartnerRequest assignPartnerRequest) {
        logger.info("PUT /api/orders/{}/assign-partner called with partnerId: {}", id, assignPartnerRequest.getPartnerId());
        
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
        
        // Verify the partner exists and is a delivery partner
        User partner = userRepository.findById(assignPartnerRequest.getPartnerId()).orElse(null);
        if (partner == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery partner not found");
        }
        
        if (partner.getUserType() != User.UserType.DELIVERY_PARTNER) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is not a delivery partner");
        }
        
        if (!partner.getIsActive()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Delivery partner is not active");
        }
        
        // Assign the partner and update status to Assigned
        order.setDeliveryPartnerId(assignPartnerRequest.getPartnerId());
        order.setStatus(OrderStatus.Assigned);
        order.setAssignedAt(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);
        
        // Broadcast the order update to all connected SSE clients
        orderEventService.sendOrderUpdate(updatedOrder);
        logger.info("Order assignment broadcasted to SSE clients");
        
        logger.info("Order {} assigned to delivery partner {}", id, assignPartnerRequest.getPartnerId());
        return ResponseEntity.ok().body("Order assigned to delivery partner successfully");
    }


    // DTO for status update
    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
    
    // DTO for partner assignment
    public static class AssignPartnerRequest {
        private Long partnerId;
        public Long getPartnerId() { return partnerId; }
        public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }
    }
}
