package com.smartkitchen.backend.dto;

public class UserProfileUpdateRequest {
    private String addressLabel;
    private String addressFull;
    private String addressApartment;
    private String addressInstructions;

    public String getAddressLabel() {
        return addressLabel;
    }
    public void setAddressLabel(String addressLabel) {
        this.addressLabel = addressLabel;
    }
    public String getAddressFull() {
        return addressFull;
    }
    public void setAddressFull(String addressFull) {
        this.addressFull = addressFull;
    }
    public String getAddressApartment() {
        return addressApartment;
    }
    public void setAddressApartment(String addressApartment) {
        this.addressApartment = addressApartment;
    }
    public String getAddressInstructions() {
        return addressInstructions;
    }
    public void setAddressInstructions(String addressInstructions) {
        this.addressInstructions = addressInstructions;
    }
}