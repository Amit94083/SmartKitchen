package com.smartkitchen.backend.service;

import com.smartkitchen.backend.entity.*;
import com.smartkitchen.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Transactional
    public Cart updateCartItem(Long userId, Long menuItemId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow();
        Cart cart = getOrCreateCart(user);
        Optional<CartItem> existing = cart.getItems().stream()
            .filter(i -> i.getMenuItem().getItemId().equals(menuItemId)).findFirst();
        if (existing.isPresent()) {
            CartItem item = existing.get();
            if (quantity > 0) {
                item.setQuantity(quantity);
            } else {
                cart.getItems().remove(item);
            }
        }
        return cartRepository.save(cart);
    }
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }
    @Transactional
    public Cart clearCart(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear(); // Remove all items from the cart
        cart.setActive(false);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart addItemToCart(Long userId, Long menuItemId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow();
        MenuItem menuItem = menuItemRepository.findById(menuItemId).orElseThrow();
        Cart cart = getOrCreateCart(user);
        Optional<CartItem> existing = cart.getItems().stream()
            .filter(i -> i.getMenuItem().getItemId().equals(menuItemId)).findFirst();
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setMenuItem(menuItem);
            item.setQuantity(quantity);
            cart.getItems().add(item);
        }
        return cartRepository.save(cart);
    }

    public Cart getCartByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return getOrCreateCart(user);
    }
}
