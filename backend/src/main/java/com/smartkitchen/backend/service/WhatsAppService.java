package com.smartkitchen.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {
    
    private static final Logger logger = LoggerFactory.getLogger(WhatsAppService.class);
    
    @Value("${whatsapp.phone.number.id}")
    private String phoneNumberId;
    
    @Value("${whatsapp.access.token}")
    private String accessToken;
    
    @Value("${whatsapp.api.version}")
    private String apiVersion;
    
    @Value("${whatsapp.api.base.url}")
    private String baseUrl;
    
    private final RestTemplate restTemplate;
    
    public WhatsAppService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Send a text message via WhatsApp
     * @param phoneNumber Recipient's phone number with country code (e.g., 919876543210)
     * @param text Message text to send
     * @return Response from WhatsApp API
     */
    public Map<String, Object> sendTextMessage(String phoneNumber, String text) {
        logger.info("=== Starting WhatsApp Message Send ===");
        logger.info("Phone Number: {}", phoneNumber);
        logger.info("Message Text: {}", text);
        
        try {
            // Build the API URL
            String url = String.format("%s/%s/%s/messages", baseUrl, apiVersion, phoneNumberId);
            logger.info("WhatsApp API URL: {}", url);
            logger.info("Phone Number ID: {}", phoneNumberId);
            logger.info("Access Token (first 20 chars): {}...", accessToken.substring(0, Math.min(20, accessToken.length())));
            
            // Build the request payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("messaging_product", "whatsapp");
            payload.put("recipient_type", "individual");
            payload.put("to", phoneNumber);
            payload.put("type", "text");
            
            Map<String, Object> textContent = new HashMap<>();
            textContent.put("preview_url", false);
            textContent.put("body", text);
            payload.put("text", textContent);
            
            logger.info("Request Payload: {}", payload);
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            
            logger.info("Request Headers: {}", headers);
            
            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            
            // Make the API call
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            logger.info("=== WhatsApp API Response ===");
            logger.info("Status Code: {}", response.getStatusCode());
            logger.info("Response Body: {}", response.getBody());
            logger.info("Response Headers: {}", response.getHeaders());
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("status", response.getStatusCode().value());
            result.put("data", response.getBody());
            result.put("url", url);
            result.put("payload", payload);
            
            return result;
            
        } catch (Exception e) {
            logger.error("=== WhatsApp Message Send Failed ===");
            logger.error("Error Type: {}", e.getClass().getName());
            logger.error("Error Message: {}", e.getMessage());
            logger.error("Stack Trace: ", e);
            
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("error", e.getMessage());
            errorResult.put("errorType", e.getClass().getSimpleName());
            
            return errorResult;
        }
    }
}
