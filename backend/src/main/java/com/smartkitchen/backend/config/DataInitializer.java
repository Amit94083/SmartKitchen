package com.smartkitchen.backend.config;

import com.smartkitchen.backend.entity.MenuItem;
import com.smartkitchen.backend.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    private final MenuItemRepository menuItemRepository;

    public DataInitializer(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void run(String... args) {
        if (menuItemRepository.count() == 0) {
            menuItemRepository.saveAll(Arrays.asList(
                new MenuItem("Farm Fresh Pizza", "Fresh tomato sauce, mozzarella cheese, capsicum, onion, sweet corn, and herbs", new BigDecimal("139"), "Pizza", true, 15, 5, 20, "FarmFreshPizza.jpg", true, 1L),
                new MenuItem("Mexican Delight", "Spicy Mexican sauce, mozzarella cheese, jalapeños, olives, onion, and capsicum", new BigDecimal("159"), "Pizza", true, 15, 5, 20, "MexicanDelightPizza.jpg", true, 1L),
                new MenuItem("Margherita Pizza", "Classic pizza with rich tomato sauce, fresh mozzarella cheese, and oregano", new BigDecimal("109"), "Pizza", true, 15, 5, 20, "MargheritaPizza.jpg", true, 1L),
                new MenuItem("Special Pizza", "Mozzarella cheese, paneer, onion, capsicum, olives, and chef’s special spices", new BigDecimal("189"), "Pizza", true, 15, 5, 20, "SpecialPizza.jpg", true, 1L),
                new MenuItem("Spicy Paneer Pizza", "Spicy paneer cubes, onion, capsicum, mozzarella cheese, and chili flakes", new BigDecimal("169"), "Pizza", true, 15, 5, 20, "PannerPizza.jpg", true, 1L),
                new MenuItem("Supreme Garlic Bread", "Crispy bread baked with garlic butter, herbs, and mozzarella cheese", new BigDecimal("99"), "Garlic Bread", true, 10, 3, 10, "SupremeGarlicBread.jpg", true, 1L),
                new MenuItem("Cheese Corn Garlic Bread", "Garlic bread topped with sweet corn, mozzarella cheese, and butter", new BigDecimal("79"), "Garlic Bread", true, 10, 3, 10, "CheeseCornGarlicBread.jpg", true, 1L),
                new MenuItem("Cheese Jalapeño Garlic Bread", "Loaded with mozzarella cheese, jalapeños, garlic butter, and herbs", new BigDecimal("89"), "Garlic Bread", true, 10, 3, 10, "CheeseJalapenoGarlicBread.jpg", true, 1L),
                new MenuItem("Cheese Paneer Garlic Bread", "Stuffed with paneer, mozzarella cheese, garlic butter, and spices", new BigDecimal("109"), "Garlic Bread", true, 10, 3, 10, "CheesePaneerGarlicBread.jpg", true, 1L),
                new MenuItem("Aloo Mutter Sandwich", "Boiled potato, green peas, spices, butter, and soft bread slices", new BigDecimal("49"), "Sandwich", true, 8, 2, 8, "AlooMutterSandwich.jpg", true, 1L),
                new MenuItem("Chocolate Sandwich", "Sweet sandwich made with chocolate spread and soft bread", new BigDecimal("49"), "Sandwich", true, 8, 2, 8, "ChocolateSandwich.jpg", true, 1L),
                new MenuItem("Bread Butter", "Fresh bread layered with creamy butter", new BigDecimal("29"), "Sandwich", true, 8, 2, 8, "BreadButter.jpeg", true, 1L),
                new MenuItem("Veg. Sandwich", "Cucumber, tomato, onion, beetroot, butter, and green chutney", new BigDecimal("49"), "Sandwich", true, 8, 2, 8, "VegSandwich.jpg", true, 1L),
                new MenuItem("Pineapple Sandwich", "Sweet pineapple slices with cream and soft bread", new BigDecimal("59"), "Sandwich", true, 8, 2, 8, "PineappleSandwich.jpeg", true, 1L),
                new MenuItem("Toast Butter", "Toasted bread served with melted butter", new BigDecimal("39"), "Sandwich", true, 8, 2, 8, "ToastButter.jpeg", true, 1L),
                new MenuItem("Jungle Mungle Sandwich", "Multi-layer sandwich with vegetables, cheese, butter, and special sauces", new BigDecimal("99"), "Sandwich", true, 8, 2, 8, "JungleMungleSandwich.jpeg", true, 1L),
                new MenuItem("Tandoori Paneer Sandwich", "Grilled sandwich with tandoori paneer, onion, capsicum, and cheese", new BigDecimal("119"), "Sandwich", true, 8, 2, 8, "TandooriPaneerSandwich.jpg", true, 1L),
                new MenuItem("Veg. Cheese Burger", "Veg patty, cheese slice, lettuce, onion, tomato, and burger sauce", new BigDecimal("89"), "Burger", true, 10, 3, 15, "Veg.CheeseBurger.jpeg", true, 1L),
                new MenuItem("Aloo Tikki Burger", "Crispy aloo tikki, onion, tomato, sauces, and soft burger bun", new BigDecimal("69"), "Burger", true, 10, 3, 15, "AlooTikkiBurger.jpeg", true, 1L),
                new MenuItem("French Fries", "Classic deep-fried potato sticks seasoned with salt", new BigDecimal("69"), "Fries", true, 7, 2, 7, "FrenchFries.jpeg", true, 1L),
                new MenuItem("Cheesy Fries", "Crispy fries topped with melted cheese and herbs", new BigDecimal("99"), "Fries", true, 7, 2, 7, "CheesyFries.jpeg", true, 1L),
                new MenuItem("Peri Peri Fries", "French fries tossed in spicy peri peri masala", new BigDecimal("79"), "Fries", true, 7, 2, 7, "PeriPeriFries.jpeg", true, 1L),
                new MenuItem("Pizza Fries", "Fries topped with pizza sauce, cheese, veggies, and herbs", new BigDecimal("99"), "Fries", true, 7, 2, 7, "PizzaFries.jpeg", true, 1L),
                new MenuItem("Simple Maggi", "Plain maggi noodles cooked with tastemaker", new BigDecimal("49"), "Maggie", true, 6, 2, 6, "SimpleMaggi.png", true, 1L),
                new MenuItem("Masala Maggi", "Maggi cooked with onion, tomato, spices, and masala", new BigDecimal("49"), "Maggie", true, 6, 2, 6, "MasalaMaggi.png", true, 1L),
                new MenuItem("Cheese Maggi", "Cheesy maggi noodles with mozzarella cheese and butter", new BigDecimal("79"), "Maggie", true, 6, 2, 6, "ChezzeMaggi.png", true, 1L),
                new MenuItem("Dahi Puri", "Crispy puris filled with potato, curd, sweet and spicy chutneys", new BigDecimal("49"), "Chaat", true, 5, 2, 5, "DahiPuri.png", true, 1L),
                new MenuItem("Sev Puri", "Puri topped with potato, chutneys, onion, and sev", new BigDecimal("49"), "Chaat", true, 5, 2, 5, "SevPuri.png", true, 1L),
                new MenuItem("Bhel", "Puffed rice mixed with onion, tomato, chutneys, and sev", new BigDecimal("49"), "Chaat", true, 5, 2, 5, "Bhel.jpeg", true, 1L),
                new MenuItem("Vanilla Milkshake", "Milk blended with vanilla ice cream and sugar", new BigDecimal("70"), "Frappe", true, 3, 1, 3, "VanillaMilkshake.png", true, 1L),
                new MenuItem("Strawberry Milkshake", "Strawberry syrup blended with milk and ice cream", new BigDecimal("100"), "Frappe", true, 3, 1, 3, "StrawberryMilkshake.png", true, 1L),
                new MenuItem("Chocolate Milkshake", "Chocolate syrup blended with milk and chocolate ice cream", new BigDecimal("120"), "Frappe", true, 3, 1, 3, "ChoclateMilkshake.png", true, 1L)
            ));
        }
    }
}
