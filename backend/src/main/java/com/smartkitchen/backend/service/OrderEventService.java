package com.smartkitchen.backend.service;

import com.smartkitchen.backend.dto.OrderDto;
import com.smartkitchen.backend.dto.OrderItemDto;
import com.smartkitchen.backend.entity.MenuItem;
import com.smartkitchen.backend.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * Service for managing Server-Sent Events (SSE) connections
 * and broadcasting real-time order updates to connected clients.
 */
@Service
public class OrderEventService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderEventService.class);
    
    // Thread-safe list to manage active SSE connections
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    
    // SSE connection timeout: 30 minutes (in milliseconds)
    private static final long SSE_TIMEOUT = 30 * 60 * 1000L;
    
    /**
     * Creates a new SSE connection and adds it to the active connections list.
     * Automatically removes the emitter on completion, timeout, or error.
     * 
     * @return SseEmitter for the new SSE connection
     */
    public SseEmitter addEmitter() {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        
        // Add the new emitter to the list
        emitters.add(emitter);
        logger.info("New SSE connection established. Total active connections: {}", emitters.size());
        
        // Remove emitter when connection is completed
        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            logger.info("SSE connection completed. Remaining connections: {}", emitters.size());
        });
        
        // Remove emitter when connection times out
        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            logger.info("SSE connection timed out. Remaining connections: {}", emitters.size());
        });
        
        // Remove emitter when an error occurs
        emitter.onError((ex) -> {
            emitters.remove(emitter);
            logger.error("SSE connection error. Remaining connections: {}", emitters.size(), ex);
        });
        
        return emitter;
    }
    
    /**
     * Broadcasts an order update to all connected clients.
     * Sends the updated order as a JSON payload with event name "ORDER_UPDATED".
     * Automatically removes any broken connections.
     * 
     * @param order The updated order to broadcast
     */
    public void sendOrderUpdate(Order order) {
        if (emitters.isEmpty()) {
            logger.debug("No active SSE connections. Skipping broadcast for order ID: {}", order.getId());
            return;
        }
        
        logger.info("Broadcasting order update for order ID: {} to {} clients", order.getId(), emitters.size());
        
        // Convert Order entity to OrderDto for JSON serialization
        OrderDto orderDto = convertToDto(order);
        
        // List to track emitters that should be removed due to errors
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        
        // Send the update to all connected clients
        emitters.forEach(emitter -> {
            try {
                // Send event with name "ORDER_UPDATED" and order data
                emitter.send(SseEmitter.event()
                        .name("ORDER_UPDATED")
                        .data(orderDto));
                
                logger.debug("Successfully sent order update to client");
            } catch (IOException e) {
                // Mark this emitter for removal if send fails
                deadEmitters.add(emitter);
                logger.warn("Failed to send order update to client. Connection will be removed.", e);
            }
        });
        
        // Remove all broken connections
        emitters.removeAll(deadEmitters);
        
        if (!deadEmitters.isEmpty()) {
            logger.info("Removed {} broken SSE connections. Active connections: {}", 
                    deadEmitters.size(), emitters.size());
        }
    }
    
    /**
     * Converts an Order entity to OrderDto for serialization.
     * 
     * @param order The order entity to convert
     * @return OrderDto with all order details
     */
    private OrderDto convertToDto(Order order) {
        // Convert order items to DTOs
        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item -> {
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
        
        // Extract customer information
        String customerName = order.getUser() != null ? order.getUser().getName() : "";
        String customerPhone = order.getUser() != null ? order.getUser().getPhone() : "";
        
        // Create and return OrderDto
        return new OrderDto(
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
    }
    
    /**
     * Gets the count of active SSE connections.
     * 
     * @return Number of active connections
     */
    public int getActiveConnectionsCount() {
        return emitters.size();
    }
}
