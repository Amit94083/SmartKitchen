package com.smartkitchen.whatsapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MessageTemplate {
    @NotBlank(message = "Template name is required")
    private String name;
    
    @NotNull(message = "Template language is required")
    private TemplateLanguage language;
    
    public MessageTemplate() {}
    
    public MessageTemplate(String name, TemplateLanguage language) {
        this.name = name;
        this.language = language;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public TemplateLanguage getLanguage() {
        return language;
    }
    
    public void setLanguage(TemplateLanguage language) {
        this.language = language;
    }
    
    @Override
    public String toString() {
        return "MessageTemplate{" +
                "name='" + name + '\'' +
                ", language=" + language +
                '}';
    }
}