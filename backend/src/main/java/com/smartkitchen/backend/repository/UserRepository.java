package com.smartkitchen.backend.repository;

import com.smartkitchen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByUserType(User.UserType userType);
    Optional<User> findByEmailAndUserType(String email, User.UserType userType);
}