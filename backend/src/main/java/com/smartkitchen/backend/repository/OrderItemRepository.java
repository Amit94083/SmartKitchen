package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.Order;
import com.smartkitchen.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.smartkitchen.backend.dto.BestSellerDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
        List<OrderItem> findByOrder(Order order);

        @Query("SELECT new com.smartkitchen.backend.dto.BestSellerDto(oi.productName, SUM(oi.quantity), SUM(oi.price * oi.quantity)) " +
            "FROM OrderItem oi GROUP BY oi.productName ORDER BY SUM(oi.quantity) DESC")
        List<BestSellerDto> findTopBestSellers(org.springframework.data.domain.Pageable pageable);
}
