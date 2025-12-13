package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "payment_cards")
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cardId;

    @NotBlank
    @Size(min = 13, max = 19, message = "Card number must be between 13 and 19 digits")
    @Pattern(regexp = "^[0-9]+$", message = "Card number must contain only digits")
    private String cardNumber;

    @NotBlank
    @Size(min = 2, message = "Cardholder name must be at least 2 characters")
    private String cardholderName;

    @NotNull
    @Min(value = 1, message = "Expiry month must be between 1 and 12")
    @Max(value = 12, message = "Expiry month must be between 1 and 12")
    private Integer expiryMonth;

    @NotNull
    @Min(value = 2024, message = "Invalid expiry year")
    private Integer expiryYear;

    @NotBlank
    @Size(min = 3, max = 4, message = "CVV must be 3 or 4 digits")
    @Pattern(regexp = "^[0-9]+$", message = "CVV must contain only digits")
    private String cvv;

    private Boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public PaymentCard() {
    }

    public PaymentCard(Long cardId, String cardNumber, String cardholderName, Integer expiryMonth, Integer expiryYear, String cvv, Boolean isDefault, User user) {
        this.cardId = cardId;
        this.cardNumber = cardNumber;
        this.cardholderName = cardholderName;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.cvv = cvv;
        this.isDefault = isDefault;
        this.user = user;
    }

    // Constructor without ID for creation
    public PaymentCard(String cardNumber, String cardholderName, Integer expiryMonth,
                      Integer expiryYear, String cvv, Boolean isDefault) {
        this.cardNumber = cardNumber;
        this.cardholderName = cardholderName;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.cvv = cvv;
        this.isDefault = isDefault;
    }

    public Long getCardId() {
        return cardId;
    }

    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardholderName() {
        return cardholderName;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public Integer getExpiryMonth() {
        return expiryMonth;
    }

    public void setExpiryMonth(Integer expiryMonth) {
        this.expiryMonth = expiryMonth;
    }

    public Integer getExpiryYear() {
        return expiryYear;
    }

    public void setExpiryYear(Integer expiryYear) {
        this.expiryYear = expiryYear;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
