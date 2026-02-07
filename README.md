# 🍽️ SmartKitchen - Cloud Kitchen Management System

A comprehensive full-stack cloud kitchen management system with inventory tracking, order management, and delivery partner coordination.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [User Roles](#user-roles)
- [Key Modules](#key-modules)
- [Getting Started](#getting-started)
- [Security](#security)
- [Database Schema](#database-schema)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## 🎯 Overview

SmartKitchen is a modern cloud kitchen management platform that streamlines operations from order placement to delivery. The system supports multiple user roles including restaurant owners, customers, and delivery partners, providing each with role-specific dashboards and functionalities.

---

## ✨ Features

### For Restaurant Owners
- **Dashboard Analytics**: Real-time overview of orders, inventory, and deliveries
- **Order Management**: Track and manage orders through multiple statuses (Placed, Confirmed, Preparing, Ready, etc.)
- **Order Status Control**: Ability to advance or revert order statuses
- **Inventory Management**: Track ingredients, set thresholds, and receive low-stock alerts
- **Recipe Management**: Map ingredients to menu items with quantity tracking
- **Supplier Management**: Manage supplier information and relationships
- **Restaurant Details**: Update restaurant information and menu items
- **Delivery Coordination**: Assign orders to delivery partners

### For Customers
- **Restaurant Browsing**: View restaurant details and menu items
- **Shopping Cart**: Add items to cart with quantity management
- **Address Management**: Save and manage multiple delivery addresses
- **Order Placement**: Place orders with delivery instructions
- **Order Tracking**: Track order status in real-time
- **Profile Management**: Update personal information and saved addresses

### For Delivery Partners
- **Delivery Dashboard**: View active deliveries and statistics
- **Order Assignment**: Receive order assignments from restaurant owners
- **Partner Management**: View delivery partner profiles and availability status
- **Delivery Status Updates**: Update order status (OnTheWay, Delivered)

---

## 🛠️ Technology Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | React, Vite, TailwindCSS, Lucide Icons |
| Backend    | Spring Boot, Java |
| Database   | PostgreSQL |
| Security   | JWT Authentication, RBAC |
| API Style  | RESTful APIs |
| Build Tools | Maven (Backend), npm (Frontend) |

---

## 👥 User Roles

The system supports three main user roles:

### 1. RESTAURANT_OWNER
- Full access to inventory, recipes, suppliers, and menu management
- Order management and delivery assignment
- Dashboard with business analytics

### 2. CUSTOMER
- Browse restaurants and menu items
- Place and track orders
- Manage delivery addresses
- Shopping cart functionality

### 3. DELIVERY_PARTNER
- View assigned deliveries
- Update delivery status
- Access delivery dashboard

---

## 🔑 Key Modules

### Order Management
- **Order Lifecycle**: Placed → Confirmed → Preparing → Ready → Assigned → OnTheWay → Delivered
- **Status Revert**: Owners can revert orders one step back in the workflow
- **Order Assignment**: Manual assignment of orders to delivery partners with availability tracking
- **Order Confirmation**: Popup confirmations for all partner assignments
- **Inventory Integration**: Automatic inventory deduction on order confirmation

### Delivery Partner Management
- **Partner Profiles**: View active delivery partners with contact details
- **Availability Tracking**: Track partners with active deliveries (Busy/Available status)
- **Order Assignment**: Assign multiple orders to partners with confirmation dialogs
- **Assignment History**: Track total deliveries and join dates

### Inventory System
1. Owner adds ingredients and sets minimum stock thresholds
2. Owner creates recipes by mapping ingredients to menu items
3. System validates ingredient availability before order confirmation
4. Inventory automatically deducted using database transactions
5. Real-time dashboard updates
6. Automatic alerts for low stock items

### Address Management
- Customers can save multiple addresses with labels
- Address synced between checkout and profile pages
- Delivery instructions support
- Apartment/suite number tracking

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start on `http://localhost:3000`

### Environment Configuration
Configure database connection in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smartkitchen
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## 🔐 Security

- **JWT-based Authentication**: Secure token-based authentication system
- **Role-Based Access Control (RBAC)**: Different permissions for different user roles
- **Protected APIs**: Owner-only access to inventory and management APIs
- **Transactional Updates**: Database transactions ensure data consistency
- **Password Encryption**: Secure password storage using BCrypt

---

## 📊 Order Workflow

1. Customer browses menu and adds items to cart
2. Customer proceeds to checkout and selects/adds delivery address
3. Customer places order
4. Order appears in Owner's dashboard with "Placed" status
5. Owner can Accept (→ Confirmed) or Reject (→ Cancelled) order
6. Owner starts preparation (→ Preparing)
7. Owner marks as Ready (→ Ready)
8. Owner assigns delivery partner (→ Assigned)
9. Delivery partner updates to OnTheWay (→ OnTheWay)
10. Delivery partner marks as Delivered (→ Delivered)

*Note: Owners can revert orders one step back at any stage*

---

## 🗃️ Database Entities

- `users` - All user types (Restaurant Owner, Customer, Delivery Partner)
- `restaurants` - Restaurant information
- `menu_items` - Menu items with pricing and categories
- `ingredients` - Raw ingredients for recipes
- `recipes` (menu_ingredients) - Ingredient-to-menu-item mapping
- `orders` - Customer orders with status tracking
- `order_items` - Individual items within orders
- `suppliers` - Supplier information
- `inventory_logs` - Audit trail for inventory changes

---

## 📄 Documentation

- Software Requirements Specification (SRS)
- ER Diagrams
- API Documentation
- Database Schema
- User Manuals

---

## 👨‍💻 Author

**Amit Chaudhary**  
SmartKitchen - Cloud Kitchen Management System  
Full Stack Development Project


