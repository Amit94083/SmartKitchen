package com.smartkitchen.backend.controller;

import com.smartkitchen.backend.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@CrossOrigin(origins = "http://localhost:3000")
public class WhatsAppController {
    
    @Autowired
    private WhatsAppService whatsAppService;
    
    /**
     * Send a text message via WhatsApp
     * POST /api/whatsapp/send-text
     * Body: { "phoneNumber": "919876543210", "text": "Hello World" }
     */
    @PostMapping("/send-text")
    public ResponseEntity<Map<String, Object>> sendTextMessage(@RequestBody SendTextRequest request) {
        Map<String, Object> result = whatsAppService.sendTextMessage(request.getPhoneNumber(), request.getText());
        return ResponseEntity.ok(result);
    }
    
    // DTO
    public static class SendTextRequest {
        private String phoneNumber;
        private String text;
        
        public String getPhoneNumber() {
            return phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
    }
}
