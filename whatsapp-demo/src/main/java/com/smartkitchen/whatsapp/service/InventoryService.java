package com.smartkitchen.whatsapp.service;

import com.smartkitchen.whatsapp.dto.OrderRequest;
import com.smartkitchen.whatsapp.dto.OrderResponse;
import com.smartkitchen.whatsapp.dto.WhatsAppMessageRequest;
import com.smartkitchen.whatsapp.dto.MessageTemplate;
import com.smartkitchen.whatsapp.dto.TemplateLanguage;
import com.smartkitchen.whatsapp.entity.Inventory;
import com.smartkitchen.whatsapp.entity.Menu;
import com.smartkitchen.whatsapp.repository.InventoryRepository;
import com.smartkitchen.whatsapp.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class InventoryService {
    
    @Autowired
    private InventoryRepository inventoryRepository;
    
    @Autowired
    private MenuRepository menuRepository;
    
    @Autowired
    private WhatsAppService whatsAppService;
    
    public List<Menu> getAllMenuItems() {
        return menuRepository.findAll();
    }
    
    public Inventory getCurrentInventory() {
        List<Inventory> inventories = inventoryRepository.findAll();
        if (inventories.isEmpty()) {
            return initializeInventory();
        }
        return inventories.get(0);
    }
    
    @Transactional
    public OrderResponse processOrder(OrderRequest orderRequest) {
        try {
            // Calculate total ingredient requirements
            Map<String, Integer> totalRequirements = calculateTotalRequirements(orderRequest);
            
            // Get current inventory
            Inventory inventory = getCurrentInventory();
            
            // Check if sufficient ingredients are available
            String availabilityError = checkIngredientAvailability(inventory, totalRequirements);
            if (availabilityError != null) {
                return OrderResponse.error(availabilityError);
            }
            
            // Deduct ingredients from inventory
            deductIngredients(inventory, totalRequirements);
            inventoryRepository.save(inventory);
            
            // Check if any inventory item is below 5 and send WhatsApp message
            List<String> lowInventoryItems = checkLowInventoryItems(inventory);
            if (!lowInventoryItems.isEmpty()) {
                sendLowInventoryAlert(lowInventoryItems);
            }
            
            // Create success message
            String message = "Order placed successfully!";
            return OrderResponse.success(message, totalRequirements);
            
        } catch (Exception e) {
            return OrderResponse.error("Error processing order: " + e.getMessage());
        }
    }
    
    private Map<String, Integer> calculateTotalRequirements(OrderRequest orderRequest) {
        Map<String, Integer> totalRequirements = new HashMap<>();
        
        for (OrderRequest.OrderItem orderItem : orderRequest.getItems()) {
            Optional<Menu> menuItemOpt = menuRepository.findByDishName(orderItem.getDishName());
            if (menuItemOpt.isPresent()) {
                Menu menuItem = menuItemOpt.get();
                int quantity = orderItem.getQuantity();
                
                addToRequirements(totalRequirements, "Bread Slices", menuItem.getBreadSlices(), quantity);
                addToRequirements(totalRequirements, "Lettuce", menuItem.getLettuce(), quantity);
                addToRequirements(totalRequirements, "Tomatoes", menuItem.getTomatoes(), quantity);
                addToRequirements(totalRequirements, "Onions", menuItem.getOnions(), quantity);
                addToRequirements(totalRequirements, "Cheese Slices", menuItem.getCheeseSlices(), quantity);
                addToRequirements(totalRequirements, "Mayonnaise", menuItem.getMayonnaise(), quantity);
                addToRequirements(totalRequirements, "Aloo Tikki", menuItem.getAlooTikki(), quantity);
                addToRequirements(totalRequirements, "Mint Chutney", menuItem.getMintChutney(), quantity);
                addToRequirements(totalRequirements, "Tamarind Chutney", menuItem.getTamarindChutney(), quantity);
                addToRequirements(totalRequirements, "Pickles", menuItem.getPickles(), quantity);
                addToRequirements(totalRequirements, "Butter", menuItem.getButter(), quantity);
            }
        }
        
        return totalRequirements;
    }
    
    private void addToRequirements(Map<String, Integer> requirements, String ingredient, Integer needed, int quantity) {
        if (needed != null && needed > 0) {
            requirements.put(ingredient, requirements.getOrDefault(ingredient, 0) + (needed * quantity));
        }
    }
    
    private String checkIngredientAvailability(Inventory inventory, Map<String, Integer> requirements) {
        List<String> insufficientIngredients = new ArrayList<>();
        
        for (Map.Entry<String, Integer> entry : requirements.entrySet()) {
            String ingredient = entry.getKey();
            int required = entry.getValue();
            int available = getInventoryValue(inventory, ingredient);
            
            if (available < required) {
                insufficientIngredients.add(ingredient + " (required: " + required + ", available: " + available + ")");
            }
        }
        
        if (!insufficientIngredients.isEmpty()) {
            return "Insufficient ingredients: " + String.join(", ", insufficientIngredients);
        }
        
        return null;
    }
    
    private void deductIngredients(Inventory inventory, Map<String, Integer> requirements) {
        for (Map.Entry<String, Integer> entry : requirements.entrySet()) {
            String ingredient = entry.getKey();
            int toDeduct = entry.getValue();
            
            switch (ingredient) {
                case "Bread Slices" -> inventory.setBreadSlices(inventory.getBreadSlices() - toDeduct);
                case "Lettuce" -> inventory.setLettuce(inventory.getLettuce() - toDeduct);
                case "Tomatoes" -> inventory.setTomatoes(inventory.getTomatoes() - toDeduct);
                case "Onions" -> inventory.setOnions(inventory.getOnions() - toDeduct);
                case "Cheese Slices" -> inventory.setCheeseSlices(inventory.getCheeseSlices() - toDeduct);
                case "Mayonnaise" -> inventory.setMayonnaise(inventory.getMayonnaise() - toDeduct);
                case "Aloo Tikki" -> inventory.setAlooTikki(inventory.getAlooTikki() - toDeduct);
                case "Mint Chutney" -> inventory.setMintChutney(inventory.getMintChutney() - toDeduct);
                case "Tamarind Chutney" -> inventory.setTamarindChutney(inventory.getTamarindChutney() - toDeduct);
                case "Pickles" -> inventory.setPickles(inventory.getPickles() - toDeduct);
                case "Butter" -> inventory.setButter(inventory.getButter() - toDeduct);
            }
        }
    }
    
    private int getInventoryValue(Inventory inventory, String ingredient) {
        return switch (ingredient) {
            case "Bread Slices" -> inventory.getBreadSlices();
            case "Lettuce" -> inventory.getLettuce();
            case "Tomatoes" -> inventory.getTomatoes();
            case "Onions" -> inventory.getOnions();
            case "Cheese Slices" -> inventory.getCheeseSlices();
            case "Mayonnaise" -> inventory.getMayonnaise();
            case "Aloo Tikki" -> inventory.getAlooTikki();
            case "Mint Chutney" -> inventory.getMintChutney();
            case "Tamarind Chutney" -> inventory.getTamarindChutney();
            case "Pickles" -> inventory.getPickles();
            case "Butter" -> inventory.getButter();
            default -> 0;
        };
    }
    
    public Inventory initializeInventory() {
        Inventory inventory = new Inventory();
        inventory.setBreadSlices(50);
        inventory.setLettuce(30);
        inventory.setTomatoes(25);
        inventory.setOnions(20);
        inventory.setCheeseSlices(40);
        inventory.setMayonnaise(15);
        inventory.setAlooTikki(20);
        inventory.setMintChutney(10);
        inventory.setTamarindChutney(10);
        inventory.setPickles(15);
        inventory.setButter(12);
        return inventoryRepository.save(inventory);
    }
    
    public void initializeMenu() {
        if (menuRepository.count() == 0) {
            // Vegetable Sandwich
            Menu vegSandwich = new Menu("Vegetable Sandwich");
            vegSandwich.setBreadSlices(2);
            vegSandwich.setLettuce(2);
            vegSandwich.setTomatoes(1);
            vegSandwich.setOnions(1);
            vegSandwich.setCheeseSlices(1);
            vegSandwich.setMayonnaise(1);
            vegSandwich.setButter(1);
            vegSandwich.setPrice(80.0);
            menuRepository.save(vegSandwich);
            
            // Aloo Tikki Burger
            Menu alooTikkiBurger = new Menu("Aloo Tikki Burger");
            alooTikkiBurger.setBreadSlices(2);
            alooTikkiBurger.setLettuce(1);
            alooTikkiBurger.setTomatoes(1);
            alooTikkiBurger.setOnions(1);
            alooTikkiBurger.setAlooTikki(1);
            alooTikkiBurger.setMintChutney(1);
            alooTikkiBurger.setTamarindChutney(1);
            alooTikkiBurger.setPickles(1);
            alooTikkiBurger.setPrice(120.0);
            menuRepository.save(alooTikkiBurger);
        }
    }
    
    private List<String> checkLowInventoryItems(Inventory inventory) {
        List<String> lowItems = new ArrayList<>();
        
        if (inventory.getBreadSlices() < 5) {
            lowItems.add("Bread Slices: " + inventory.getBreadSlices());
        }
        if (inventory.getLettuce() < 5) {
            lowItems.add("Lettuce: " + inventory.getLettuce());
        }
        if (inventory.getTomatoes() < 5) {
            lowItems.add("Tomatoes: " + inventory.getTomatoes());
        }
        if (inventory.getOnions() < 5) {
            lowItems.add("Onions: " + inventory.getOnions());
        }
        if (inventory.getCheeseSlices() < 5) {
            lowItems.add("Cheese Slices: " + inventory.getCheeseSlices());
        }
        if (inventory.getMayonnaise() < 5) {
            lowItems.add("Mayonnaise: " + inventory.getMayonnaise());
        }
        if (inventory.getAlooTikki() < 5) {
            lowItems.add("Aloo Tikki: " + inventory.getAlooTikki());
        }
        if (inventory.getMintChutney() < 5) {
            lowItems.add("Mint Chutney: " + inventory.getMintChutney());
        }
        if (inventory.getTamarindChutney() < 5) {
            lowItems.add("Tamarind Chutney: " + inventory.getTamarindChutney());
        }
        if (inventory.getPickles() < 5) {
            lowItems.add("Pickles: " + inventory.getPickles());
        }
        if (inventory.getButter() < 5) {
            lowItems.add("Butter: " + inventory.getButter());
        }
        
        return lowItems;
    }
    
    private void sendLowInventoryAlert(List<String> lowItems) {
        try {
            String alertMessage = "🚨 LOW INVENTORY ALERT! The following items are running low (less than 5): " 
                + String.join(", ", lowItems) + ". Please restock soon!";
            
            System.out.println("📱 Sending WhatsApp alert for low inventory: " + alertMessage);
            
            // Create WhatsApp message request (same format as frontend was sending)
            WhatsAppMessageRequest request = new WhatsAppMessageRequest();
            request.setTo("+919104975168");
            
            MessageTemplate template = new MessageTemplate();
            template.setName("hello_world");
            
            TemplateLanguage language = new TemplateLanguage();
            language.setCode("en_US");
            template.setLanguage(language);
            
            request.setTemplate(template);
            
            // Send WhatsApp message
            whatsAppService.sendMessage(request).block();
            
            System.out.println("✅ WhatsApp low inventory alert sent successfully!");
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send WhatsApp low inventory alert: " + e.getMessage());
        }
    }
}