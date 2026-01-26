package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Additional query methods if needed
    List<MenuItem> findByName(String name);
}
