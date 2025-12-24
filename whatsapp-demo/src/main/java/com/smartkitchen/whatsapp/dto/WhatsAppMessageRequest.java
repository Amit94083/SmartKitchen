package com.smartkitchen.whatsapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class WhatsAppMessageRequest {
    
    @NotBlank(message = "Recipient phone number is required")
    @Pattern(regexp = "^\\+?\\d{10,15}$", message = "Phone number should be 10-15 digits with optional + prefix")
    private String to;
    
    @NotNull(message = "Template is required")
    private MessageTemplate template;
    
    public WhatsAppMessageRequest() {}
    
    public WhatsAppMessageRequest(String to, MessageTemplate template) {
        this.to = to;
        this.template = template;
    }
    
    public String getTo() {
        return to;
    }
    
    public void setTo(String to) {
        this.to = to;
    }
    
    public MessageTemplate getTemplate() {
        return template;
    }
    
    public void setTemplate(MessageTemplate template) {
        this.template = template;
    }
    
    @Override
    public String toString() {
        return "WhatsAppMessageRequest{" +
                "to='" + to + '\'' +
                ", template=" + template +
                '}';
    }
}