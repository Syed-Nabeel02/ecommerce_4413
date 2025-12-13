package com.ecommerce.project.controller;

import com.ecommerce.project.model.User;
import com.ecommerce.project.DTO.PaymentCardDTO;
import com.ecommerce.project.service.Interface.IPaymentCardService;
import com.ecommerce.project.helper.AuthHelper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PaymentCardController {

    @Autowired
    AuthHelper authHelper;

    @Autowired
    IPaymentCardService IPaymentCardService;

    @PostMapping("/payment-cards")
    public ResponseEntity<PaymentCardDTO> createPaymentCard(@Valid @RequestBody PaymentCardDTO paymentCardDTO) {
        User user = authHelper.loggedInUser();
        PaymentCardDTO savedCard = IPaymentCardService.createPaymentCard(paymentCardDTO, user);
        return new ResponseEntity<>(savedCard, HttpStatus.CREATED);
    }

    @GetMapping("/payment-cards")
    public ResponseEntity<List<PaymentCardDTO>> getAllPaymentCards() {
        List<PaymentCardDTO> cards = IPaymentCardService.getPaymentCards();
        return new ResponseEntity<>(cards, HttpStatus.OK);
    }

    @GetMapping("/payment-cards/{cardId}")
    public ResponseEntity<PaymentCardDTO> getPaymentCardById(@PathVariable Long cardId) {
        PaymentCardDTO card = IPaymentCardService.getPaymentCardById(cardId);
        return new ResponseEntity<>(card, HttpStatus.OK);
    }

    @GetMapping("/users/payment-cards")
    public ResponseEntity<List<PaymentCardDTO>> getUserPaymentCards() {
        User user = authHelper.loggedInUser();
        List<PaymentCardDTO> cards = IPaymentCardService.getUserPaymentCards(user);
        return new ResponseEntity<>(cards, HttpStatus.OK);
    }

    @GetMapping("/users/payment-cards/default")
    public ResponseEntity<PaymentCardDTO> getUserDefaultCard() {
        User user = authHelper.loggedInUser();
        PaymentCardDTO card = IPaymentCardService.getUserDefaultCard(user);
        return new ResponseEntity<>(card, HttpStatus.OK);
    }

    @GetMapping("/admin/payment-cards/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentCardDTO>> getUserPaymentCardsByUserId(@PathVariable Long userId) {
        List<PaymentCardDTO> cards = IPaymentCardService.getUserPaymentCardsByUserId(userId);
        return new ResponseEntity<>(cards, HttpStatus.OK);
    }

    @PutMapping("/payment-cards/{cardId}")
    public ResponseEntity<PaymentCardDTO> updatePaymentCard(
            @PathVariable Long cardId,
            @RequestBody PaymentCardDTO paymentCardDTO) {
        PaymentCardDTO updated = IPaymentCardService.updatePaymentCard(cardId, paymentCardDTO);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PutMapping("/payment-cards/{cardId}/set-default")
    public ResponseEntity<PaymentCardDTO> setDefaultCard(@PathVariable Long cardId) {
        User user = authHelper.loggedInUser();
        PaymentCardDTO updated = IPaymentCardService.setDefaultCard(cardId, user);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/payment-cards/{cardId}")
    public ResponseEntity<String> deletePaymentCard(@PathVariable Long cardId) {
        String status = IPaymentCardService.deletePaymentCard(cardId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
