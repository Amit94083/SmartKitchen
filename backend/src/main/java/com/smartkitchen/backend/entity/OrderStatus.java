package com.smartkitchen.backend.entity;

// Enum for all possible order statuses
public enum OrderStatus {
    Placed,        // ✔️
    Confirmed,     // Confirmed
    Preparing,     // 🥣
    Ready,         // Ready
    OnTheWay,      // 🚴‍♂️
    Delivered,     // 🏠
    Cancelled      // ❌
}