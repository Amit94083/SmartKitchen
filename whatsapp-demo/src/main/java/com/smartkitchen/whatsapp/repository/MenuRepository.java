package com.smartkitchen.whatsapp.repository;

import com.smartkitchen.whatsapp.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByDishName(String dishName);
}