package com.smartkitchen.whatsapp.dto;

import java.util.List;

public class TemplateComponent {
    private String type;
    private List<TemplateParameter> parameters;
    
    public TemplateComponent() {}
    
    public TemplateComponent(String type, List<TemplateParameter> parameters) {
        this.type = type;
        this.parameters = parameters;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public List<TemplateParameter> getParameters() {
        return parameters;
    }
    
    public void setParameters(List<TemplateParameter> parameters) {
        this.parameters = parameters;
    }
    
    @Override
    public String toString() {
        return "TemplateComponent{" +
                "type='" + type + '\'' +
                ", parameters=" + parameters +
                '}';
    }
}