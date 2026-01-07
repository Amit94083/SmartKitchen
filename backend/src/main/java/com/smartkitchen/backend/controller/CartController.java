package com.smartkitchen.backend.controller;
import com.smartkitchen.backend.entity.Cart;
import com.smartkitchen.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public Cart addToCart(@RequestParam Long userId, @RequestParam Long menuItemId, @RequestParam(defaultValue = "1") int quantity) {
        logger.info("[POST] /api/cart/add | userId={}, menuItemId={}, quantity={}", userId, menuItemId, quantity);
        Cart cart = cartService.addItemToCart(userId, menuItemId, quantity);
        logger.info("[POST] /api/cart/add | cart after add: {}", cart);
        return cart;
    }

    @GetMapping("/user/{userId}")
    public Cart getCart(@PathVariable Long userId) {
        logger.info("[GET] /api/cart/user/{} called", userId);
        Cart cart = cartService.getCartByUserId(userId);
        logger.info("[GET] /api/cart/user/{} | cart: {}", userId, cart);
        return cart;
    }

    @PutMapping("/update")
    public Cart updateCartItem(@RequestParam Long userId, @RequestParam Long menuItemId, @RequestParam int quantity) {
        logger.info("[PUT] /api/cart/update | userId={}, menuItemId={}, quantity={}", userId, menuItemId, quantity);
        Cart cart = cartService.updateCartItem(userId, menuItemId, quantity);
        logger.info("[PUT] /api/cart/update | cart after update: {}", cart);
        return cart;
    }
    @DeleteMapping("/remove")
    public Cart removeFromCart(@RequestParam Long userId, @RequestParam Long menuItemId) {
        logger.info("[DELETE] /api/cart/remove | userId={}, menuItemId={}", userId, menuItemId);
        Cart cart = cartService.updateCartItem(userId, menuItemId, 0);
        logger.info("[DELETE] /api/cart/remove | cart after remove: {}", cart);
        return cart;
    }
}
