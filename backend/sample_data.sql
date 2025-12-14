-- Sample data for Smart Kitchen application
-- Use password: "password" for all accounts (hashed with BCrypt)

-- Insert sample owners first
INSERT INTO owners (restaurant_name, owner_name, email, password, phone) VALUES
('Pizza Palace', 'Mario Rossi', 'mario@pizzapalace.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567890'),
('Burger Barn', 'John Smith', 'john@burgerbarn.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567891'),
('Sushi Zen', 'Takeshi Yamamoto', 'takeshi@sushizen.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567892'),
('Taco Fiesta', 'Carlos Rodriguez', 'carlos@tacofiesta.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567893'),
('The Green Kitchen', 'Emma Wilson', 'emma@greenkitchen.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1234567894');

-- Insert sample restaurants (these will be linked to owners above)
INSERT INTO restaurants (name, description, address, phone, cuisine_type, rating, is_open, owner_id) VALUES
('Pizza Palace', 'Authentic Italian pizzas made with fresh ingredients and traditional recipes', '123 Main St, Food City', '+1234567890', 'Italian', 4.5, true, 1),
('Burger Barn', 'Juicy gourmet burgers made from premium beef with crispy fries', '456 Oak Ave, Food City', '+1234567891', 'American', 4.2, true, 2),
('Sushi Zen', 'Fresh sashimi and creative rolls in a peaceful atmosphere', '789 Pine St, Food City', '+1234567892', 'Japanese', 4.8, true, 3),
('Taco Fiesta', 'Vibrant Mexican flavors with authentic street tacos and margaritas', '321 Elm St, Food City', '+1234567893', 'Mexican', 4.3, true, 4),
('The Green Kitchen', 'Healthy vegetarian and vegan options made from organic ingredients', '654 Maple Ave, Food City', '+1234567894', 'Vegetarian', 4.6, true, 5);

-- Insert sample customers
INSERT INTO customers (name, email, password, phone) VALUES
('Alice Johnson', 'alice@customer.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1987654321'),
('Bob Williams', 'bob@customer.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1987654322'),
('Carol Davis', 'carol@customer.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1987654323');