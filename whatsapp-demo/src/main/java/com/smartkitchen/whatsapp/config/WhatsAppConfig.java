package com.smartkitchen.whatsapp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "meta.whatsapp")
public class WhatsAppConfig {
    
    private String phoneNumberId;
    private String accessToken;
    private String apiUrl;
    private String webhookVerifyToken;
    
    public String getPhoneNumberId() {
        return phoneNumberId;
    }
    
    public void setPhoneNumberId(String phoneNumberId) {
        this.phoneNumberId = phoneNumberId;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getApiUrl() {
        return apiUrl;
    }
    
    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }
    
    public String getWebhookVerifyToken() {
        return webhookVerifyToken;
    }
    
    public void setWebhookVerifyToken(String webhookVerifyToken) {
        this.webhookVerifyToken = webhookVerifyToken;
    }
    
    public String getMessagesEndpoint() {
        return apiUrl + "/" + phoneNumberId + "/messages";
    }
}