package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.Owner;
import com.smartkitchen.backend.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByIsOpenTrue();
    List<Restaurant> findByCuisineTypeIgnoreCase(String cuisineType);
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    Optional<Restaurant> findByOwner(Owner owner);
}