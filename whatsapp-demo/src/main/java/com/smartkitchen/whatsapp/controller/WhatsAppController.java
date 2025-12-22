package com.smartkitchen.whatsapp.controller;

import com.smartkitchen.whatsapp.dto.WhatsAppMessageRequest;
import com.smartkitchen.whatsapp.dto.WhatsAppMessageResponse;
import com.smartkitchen.whatsapp.service.WhatsAppService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

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
        
        logger.info("Received request to send WhatsApp message: {}", request);
        
        return whatsAppService.sendMessage(request)
                .map(response -> {
                    if (response.isSuccess()) {
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.badRequest().body(response);
                    }
                })
                .onErrorResume(ex -> {
                    logger.error("Error in controller while sending message", ex);
                    WhatsAppMessageResponse errorResponse = 
                        WhatsAppMessageResponse.error("Internal server error", request.getTo());
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(errorResponse));
                });
    }
}