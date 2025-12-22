package com.smartkitchen.whatsapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class WhatsAppMessageRequest {
    
    @NotBlank(message = "Recipient phone number is required")
    @Pattern(regexp = "^\\d{10,15}$", message = "Phone number should be 10-15 digits")
    private String to;
    
    @NotBlank(message = "Message type is required")
    private String type = "text"; // "text" or "template"
    
    // For text messages
    private String message;
    
    // For template messages
    private MessageTemplate template;
    
    public WhatsAppMessageRequest() {}
    
    public WhatsAppMessageRequest(String to, String message) {
        this.to = to;
        this.message = message;
        this.type = "text";
    }
    
    public WhatsAppMessageRequest(String to, MessageTemplate template) {
        this.to = to;
        this.template = template;
        this.type = "template";
    }
    
    public String getTo() {
        return to;
    }
    
    public void setTo(String to) {
        this.to = to;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public MessageTemplate getTemplate() {
        return template;
    }
    
    public void setTemplate(MessageTemplate template) {
        this.template = template;
    }
    
    // Backwards compatibility
    public String getMessageType() {
        return type;
    }
    
    public void setMessageType(String messageType) {
        this.type = messageType;
    }
    
    @Override
    public String toString() {
        return "WhatsAppMessageRequest{" +
                "to='" + to + '\'' +
                ", type='" + type + '\'' +
                ", message='" + message + '\'' +
                ", template=" + template +
                '}';
    }
}