package com.smartkitchen.backend.entity;

// Enum for all possible order statuses
public enum OrderStatus {
    Placed,        // ✔️
    Confirmed,     // Confirmed
    Preparing,     // 🥣
    Ready,         // Ready
    Assigned,      // 📋 Assigned to delivery partner
    OnTheWay,      // 🚴‍♂️ Partner picked up and on the way
    Delivered,     // 🏠
    Cancelled      // ❌
}