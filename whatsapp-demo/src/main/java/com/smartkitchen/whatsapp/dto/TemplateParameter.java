package com.smartkitchen.whatsapp.dto;

public class TemplateParameter {
    private String type;
    private String text;
    
    public TemplateParameter() {}
    
    public TemplateParameter(String type, String text) {
        this.type = type;
        this.text = text;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    @Override
    public String toString() {
        return "TemplateParameter{" +
                "type='" + type + '\'' +
                ", text='" + text + '\'' +
                '}';
    }
}