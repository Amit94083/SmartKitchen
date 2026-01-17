package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.dto.BestSellerDto;
import com.smartkitchen.backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AnalyticsController {
    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping("/api/best-sellers")
    public List<BestSellerDto> getBestSellers(@RequestParam(defaultValue = "5") int limit) {
        return orderItemRepository.findTopBestSellers(PageRequest.of(0, limit));
    }
}
