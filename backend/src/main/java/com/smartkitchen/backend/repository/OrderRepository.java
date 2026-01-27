package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.Order;
import com.smartkitchen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.menuItem WHERE o.id = :id")
    Optional<Order> findByIdWithUser(@Param("id") Long id);
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.menuItem")
    List<Order> findAllWithUser();
    
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.menuItem WHERE o.user = :user")
    List<Order> findByUserWithUser(@Param("user") User user);
}
