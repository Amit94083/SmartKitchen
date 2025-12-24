package com.smartkitchen.whatsapp.controller;

import com.smartkitchen.whatsapp.dto.WhatsAppMessageRequest;
import com.smartkitchen.whatsapp.dto.WhatsAppMessageResponse;
import com.smartkitchen.whatsapp.service.WhatsAppService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.time.Instant;

@RestController
@RequestMapping("/api/v1/whatsapp")
@CrossOrigin(origins = "*")
public class WhatsAppController {
    
    private static final Logger logger = LoggerFactory.getLogger(WhatsAppController.class);
    
    private final WhatsAppService whatsAppService;
    
    @Autowired
    public WhatsAppController(WhatsAppService whatsAppService) {
        this.whatsAppService = whatsAppService;
    }
    
    @PostMapping("/send-message")
    public Mono<ResponseEntity<WhatsAppMessageResponse>> sendMessage(
            @Valid @RequestBody WhatsAppMessageRequest request) {
        
        // Generate request ID for tracing
        String requestId = "req_" + Instant.now().toEpochMilli();
        MDC.put("requestId", requestId);
        MDC.put("endpoint", "send-message");
        MDC.put("phoneNumber", request.getTo());
        
        logger.info("Received WhatsApp message request", 
            "requestId", requestId,
            "phoneNumber", request.getTo(),
            "templateName", request.getTemplate().getName(),
            "userAgent", request.getClass().getSimpleName());
        
        long startTime = System.currentTimeMillis();
        
        return whatsAppService.sendMessage(request)
                .map(response -> {
                    long duration = System.currentTimeMillis() - startTime;
                    
                    if (response.isSuccess()) {
                        logger.info("WhatsApp message request completed successfully",
                            "requestId", requestId,
                            "duration", duration,
                            "messageId", response.getMessageId(),
                            "status", response.getStatus());
                        return ResponseEntity.ok(response);
                    } else {
                        logger.warn("WhatsApp message request failed",
                            "requestId", requestId,
                            "duration", duration,
                            "errorMessage", response.getErrorMessage());
                        return ResponseEntity.badRequest().body(response);
                    }
                })
                .onErrorResume(ex -> {
                    long duration = System.currentTimeMillis() - startTime;
                    logger.error("Controller error during WhatsApp message processing",
                        "requestId", requestId,
                        "duration", duration,
                        "exceptionType", ex.getClass().getSimpleName(),
                        "errorMessage", ex.getMessage());
                    
                    WhatsAppMessageResponse errorResponse = 
                        WhatsAppMessageResponse.error("Internal server error", request.getTo());
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(errorResponse));
                })
                .doFinally(signal -> MDC.clear());
    }
}