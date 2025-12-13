package com.ecommerce.project.service.Interface;

import com.ecommerce.project.model.User;
import com.ecommerce.project.DTO.PaymentCardDTO;

import java.util.List;

public interface IPaymentCardService {
    PaymentCardDTO createPaymentCard(PaymentCardDTO paymentCardDTO, User user);

    List<PaymentCardDTO> getPaymentCards();

    PaymentCardDTO getPaymentCardById(Long cardId);

    List<PaymentCardDTO> getUserPaymentCards(User user);

    List<PaymentCardDTO> getUserPaymentCardsByUserId(Long userId);

    PaymentCardDTO updatePaymentCard(Long cardId, PaymentCardDTO paymentCardDTO);

    String deletePaymentCard(Long cardId);

    PaymentCardDTO setDefaultCard(Long cardId, User user);

    PaymentCardDTO getUserDefaultCard(User user);
}
