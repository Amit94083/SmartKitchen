package com.smartkitchen.whatsapp.service;

import com.smartkitchen.whatsapp.config.WhatsAppConfig;
import com.smartkitchen.whatsapp.dto.MessageTemplate;
import com.smartkitchen.whatsapp.dto.WhatsAppMessageRequest;
import com.smartkitchen.whatsapp.dto.WhatsAppMessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {
    
    private static final Logger logger = LoggerFactory.getLogger(WhatsAppService.class);
    
    private final WebClient webClient;
    private final WhatsAppConfig whatsAppConfig;
    
    @Autowired
    public WhatsAppService(WebClient webClient, WhatsAppConfig whatsAppConfig) {
        this.webClient = webClient;
        this.whatsAppConfig = whatsAppConfig;
    }
    
    public Mono<WhatsAppMessageResponse> sendMessage(WhatsAppMessageRequest request) {
        logger.info("Sending WhatsApp message to: {}", request.getTo());
        
        // Validate configuration
        if (whatsAppConfig.getAccessToken() == null || whatsAppConfig.getPhoneNumberId() == null) {
            logger.error("WhatsApp configuration is incomplete");
            return Mono.just(WhatsAppMessageResponse.error("WhatsApp configuration is incomplete", request.getTo()));
        }
        
        // Prepare the message payload according to Meta WhatsApp API format
        Map<String, Object> messagePayload = createMessagePayload(request);
        
        return webClient.post()
                .uri(whatsAppConfig.getMessagesEndpoint())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + whatsAppConfig.getAccessToken())
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(messagePayload)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> handleSuccessResponse(response, request.getTo()))
                .doOnSuccess(response -> logger.info("Message sent successfully: {}", response))
                .onErrorResume(WebClientResponseException.class, 
                    ex -> handleErrorResponse(ex, request.getTo()))
                .onErrorResume(Exception.class, 
                    ex -> handleGenericError(ex, request.getTo()));
    }
    
    private Map<String, Object> createMessagePayload(WhatsAppMessageRequest request) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("messaging_product", "whatsapp");
        payload.put("to", request.getTo());
        payload.put("type", request.getType());
        
        if ("text".equals(request.getType())) {
            // Text message
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                throw new IllegalArgumentException("Message content is required for text messages");
            }
            Map<String, String> text = new HashMap<>();
            text.put("body", request.getMessage());
            payload.put("text", text);
        } else if ("template".equals(request.getType())) {
            // Template message
            if (request.getTemplate() == null) {
                throw new IllegalArgumentException("Template is required for template messages");
            }
            payload.put("template", createTemplatePayload(request.getTemplate()));
        } else {
            throw new IllegalArgumentException("Unsupported message type: " + request.getType());
        }
        
        return payload;
    }
    
    private Map<String, Object> createTemplatePayload(MessageTemplate template) {
        Map<String, Object> templatePayload = new HashMap<>();
        templatePayload.put("name", template.getName());
        
        if (template.getLanguage() != null) {
            Map<String, String> language = new HashMap<>();
            language.put("code", template.getLanguage().getCode());
            templatePayload.put("language", language);
        }
        
        if (template.getComponents() != null && !template.getComponents().isEmpty()) {
            templatePayload.put("components", template.getComponents());
        }
        
        return templatePayload;
    }
    
    private WhatsAppMessageResponse handleSuccessResponse(Map<String, Object> response, String to) {
        logger.debug("Meta API Response: {}", response);
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> messages = (Map<String, Object>) ((java.util.List<?>) response.get("messages")).get(0);
            String messageId = (String) messages.get("id");
            
            return WhatsAppMessageResponse.success(messageId, to);
        } catch (Exception e) {
            logger.error("Error parsing success response: {}", e.getMessage());
            return WhatsAppMessageResponse.success("unknown", to);
        }
    }
    
    private Mono<WhatsAppMessageResponse> handleErrorResponse(WebClientResponseException ex, String to) {
        logger.error("WhatsApp API error: Status {} - Body: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
        
        String errorMessage = "Failed to send message";
        try {
            // You can parse the error response here for more specific error messages
            errorMessage = "API Error: " + ex.getStatusCode() + " - " + ex.getMessage();
        } catch (Exception e) {
            logger.error("Error parsing error response", e);
        }
        
        return Mono.just(WhatsAppMessageResponse.error(errorMessage, to));
    }
    
    private Mono<WhatsAppMessageResponse> handleGenericError(Exception ex, String to) {
        logger.error("Unexpected error while sending message", ex);
        return Mono.just(WhatsAppMessageResponse.error("Unexpected error: " + ex.getMessage(), to));
    }
    
    public Mono<Boolean> validateWebhook(String mode, String token, String challenge) {
        if ("subscribe".equals(mode) && whatsAppConfig.getWebhookVerifyToken().equals(token)) {
            logger.info("Webhook verified successfully");
            return Mono.just(true);
        }
        logger.warn("Webhook verification failed");
        return Mono.just(false);
    }
}