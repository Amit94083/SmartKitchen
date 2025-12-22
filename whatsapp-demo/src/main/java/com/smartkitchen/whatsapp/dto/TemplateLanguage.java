package com.smartkitchen.whatsapp.dto;

public class TemplateLanguage {
    private String code;
    
    public TemplateLanguage() {}
    
    public TemplateLanguage(String code) {
        this.code = code;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    @Override
    public String toString() {
        return "TemplateLanguage{" +
                "code='" + code + '\'' +
                '}';
    }
}