
---

## 🛠️ Technology Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | React |
| Backend    | Spring Boot |
| Database   | PostgreSQL |
| Security   | JWT, RBAC |
| API Style  | REST |

---

## 🔐 Security

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Owner-only access to inventory management APIs
- Transactional inventory updates

---

## 📊 Inventory Workflow

1. Owner adds ingredients and sets threshold
2. Owner maps ingredients to menu items (recipes)
3. Customer places an order
4. System validates ingredient availability
5. Inventory is deducted using transactions
6. Dashboard updates in real time
7. Alerts triggered if stock is low

---

## 🗃️ Database Entities (High-Level)

- `ingredients`
- `menu_items`
- `menu_ingredients`
- `orders`
- `order_items`
- `inventory_logs`

---

## 🚀 Future Enhancements

- Supplier management
- Auto restocking suggestions
- Expiry date tracking
- Demand forecasting using AI
- Multi-kitchen inventory sharing

---

## 📄 Documentation

- Software Requirements Specification (SRS)
- ER Diagrams
- API Documentation
- Database Schema

---

## 👨‍💻 Author

**Amit Chaudhary**  
Cloud Kitchen Inventory Management System  
Final Year / Full Stack Project

---

## 📜 License

This project is for **educational and learning purposes**.
