package com.smartkitchen.whatsapp.dto;

import java.util.List;

public class MessageTemplate {
    private String name;
    private TemplateLanguage language;
    private List<TemplateComponent> components;
    
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
    
    public List<TemplateComponent> getComponents() {
        return components;
    }
    
    public void setComponents(List<TemplateComponent> components) {
        this.components = components;
    }
    
    @Override
    public String toString() {
        return "MessageTemplate{" +
                "name='" + name + '\'' +
                ", language=" + language +
                ", components=" + components +
                '}';
    }
}