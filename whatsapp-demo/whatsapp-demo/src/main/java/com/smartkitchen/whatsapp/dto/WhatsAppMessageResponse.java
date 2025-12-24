package com.smartkitchen.whatsapp.dto;

public class WhatsAppMessageResponse {
    
    private boolean success;
    private String messageId;
    private String status;
    private String errorMessage;
    private String to;
    
    public WhatsAppMessageResponse() {}
    
    public WhatsAppMessageResponse(boolean success, String messageId, String status, String to) {
        this.success = success;
        this.messageId = messageId;
        this.status = status;
        this.to = to;
    }
    
    public static WhatsAppMessageResponse success(String messageId, String to) {
        return new WhatsAppMessageResponse(true, messageId, "sent", to);
    }
    
    public static WhatsAppMessageResponse error(String errorMessage, String to) {
        WhatsAppMessageResponse response = new WhatsAppMessageResponse();
        response.success = false;
        response.errorMessage = errorMessage;
        response.to = to;
        response.status = "failed";
        return response;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessageId() {
        return messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public String getTo() {
        return to;
    }
    
    public void setTo(String to) {
        this.to = to;
    }
    
    @Override
    public String toString() {
        return "WhatsAppMessageResponse{" +
                "success=" + success +
                ", messageId='" + messageId + '\'' +
                ", status='" + status + '\'' +
                ", errorMessage='" + errorMessage + '\'' +
                ", to='" + to + '\'' +
                '}';
    }
}