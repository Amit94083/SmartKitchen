package com.smartkitchen.whatsapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class TemplateLanguage {
    @NotBlank(message = "Language code is required")
    @Pattern(regexp = "^[a-z]{2}(_[A-Z]{2})?$", message = "Language code must be in format: en, en_US, etc.")
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