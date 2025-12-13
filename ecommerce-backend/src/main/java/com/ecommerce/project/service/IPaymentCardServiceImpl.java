package com.ecommerce.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.ecommerce.project.DAO.PaymentCardDAO;
import com.ecommerce.project.DAO.UserDAO;
import com.ecommerce.project.DTO.PaymentCardDTO;
import com.ecommerce.project.errorHandler.APIException;
import com.ecommerce.project.errorHandler.ResourceNotFoundException;
import com.ecommerce.project.model.PaymentCard;
import com.ecommerce.project.model.User;
import com.ecommerce.project.service.Interface.IPaymentCardService;

@Service
public class IPaymentCardServiceImpl implements IPaymentCardService {

    private final PaymentCardDAO paymentCardDAO;
    private final UserDAO userDAO;
    private final ModelMapper modelMapper;

    public IPaymentCardServiceImpl(PaymentCardDAO paymentCardDAO, UserDAO userDAO, ModelMapper modelMapper) {
        this.paymentCardDAO = paymentCardDAO;
        this.userDAO = userDAO;
        this.modelMapper = modelMapper;
    }

    @Override
    public PaymentCardDTO createPaymentCard(PaymentCardDTO paymentCardDTO, User user) {
        handleDefaultCardSetting(paymentCardDTO, user);

        PaymentCard newCard = convertDTOToEntity(paymentCardDTO);
        newCard.setUser(user);

        addCardToUserPaymentsList(user, newCard);

        PaymentCard persistedCard = paymentCardDAO.save(newCard);
        return convertEntityToDTO(persistedCard);
    }

    @Override
    public List<PaymentCardDTO> getPaymentCards() {
        List<PaymentCard> allCards = paymentCardDAO.findAll();
        return transformCardsToDTO(allCards);
    }

    @Override
    public PaymentCardDTO getPaymentCardById(Long cardId) {
        PaymentCard card = fetchPaymentCardOrThrowException(cardId);
        return convertEntityToDTO(card);
    }

    @Override
    public List<PaymentCardDTO> getUserPaymentCards(User user) {
        List<PaymentCard> userCards = user.getPaymentCards();
        return transformCardsToDTO(userCards);
    }

    @Override
    public List<PaymentCardDTO> getUserPaymentCardsByUserId(Long userId) {
        User accountUser = fetchUserByIdOrThrowException(userId);
        List<PaymentCard> userCards = accountUser.getPaymentCards();
        return transformCardsToDTO(userCards);
    }

    @Override
    public PaymentCardDTO updatePaymentCard(Long cardId, PaymentCardDTO paymentCardDTO) {
        PaymentCard existingCard = fetchPaymentCardOrThrowException(cardId);

        updateCardDetails(existingCard, paymentCardDTO);
        handleDefaultCardUpdate(existingCard, paymentCardDTO);

        PaymentCard updatedCard = paymentCardDAO.save(existingCard);
        updateUserCardsList(existingCard.getUser(), existingCard, cardId);

        return convertEntityToDTO(updatedCard);
    }

    @Override
    public String deletePaymentCard(Long cardId) {
        PaymentCard cardToDelete = fetchPaymentCardOrThrowException(cardId);
        removeCardFromUserPaymentsList(cardToDelete.getUser(), cardId);
        paymentCardDAO.delete(cardToDelete);

        return buildDeletionMessage(cardId);
    }

    @Override
    public PaymentCardDTO setDefaultCard(Long cardId, User user) {
        PaymentCard card = fetchPaymentCardOrThrowException(cardId);

        validateCardBelongsToUser(card, user);
        unsetAllDefaultCards(user);

        card.setIsDefault(true);
        PaymentCard updatedCard = paymentCardDAO.save(card);

        return convertEntityToDTO(updatedCard);
    }

    @Override
    public PaymentCardDTO getUserDefaultCard(User user) {
        PaymentCard defaultCard = paymentCardDAO.findByUserAndIsDefaultTrue(user)
                .orElseThrow(() -> new ResourceNotFoundException("Default Payment Card", "user", user.getUserId()));
        return convertEntityToDTO(defaultCard);
    }

    private PaymentCard convertDTOToEntity(PaymentCardDTO paymentCardDTO) {
        return modelMapper.map(paymentCardDTO, PaymentCard.class);
    }

    private PaymentCardDTO convertEntityToDTO(PaymentCard paymentCard) {
        return modelMapper.map(paymentCard, PaymentCardDTO.class);
    }

    private List<PaymentCardDTO> transformCardsToDTO(List<PaymentCard> cards) {
        return cards.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }

    private PaymentCard fetchPaymentCardOrThrowException(Long cardId) {
        return paymentCardDAO.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentCard", "cardId", cardId));
    }

    private User fetchUserByIdOrThrowException(Long userId) {
        return userDAO.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    private void handleDefaultCardSetting(PaymentCardDTO paymentCardDTO, User user) {
        if (isCardMarkedAsDefault(paymentCardDTO)) {
            unsetAllDefaultCards(user);
        }
    }

    private void handleDefaultCardUpdate(PaymentCard card, PaymentCardDTO paymentCardDTO) {
        if (isCardMarkedAsDefault(paymentCardDTO)) {
            unsetAllDefaultCards(card.getUser());
            card.setIsDefault(true);
        } else if (paymentCardDTO.getIsDefault() != null) {
            card.setIsDefault(paymentCardDTO.getIsDefault());
        }
    }

    private boolean isCardMarkedAsDefault(PaymentCardDTO paymentCardDTO) {
        return paymentCardDTO.getIsDefault() != null && paymentCardDTO.getIsDefault();
    }

    private void updateCardDetails(PaymentCard card, PaymentCardDTO paymentCardDTO) {
        card.setCardNumber(paymentCardDTO.getCardNumber());
        card.setCardholderName(paymentCardDTO.getCardholderName());
        card.setExpiryMonth(paymentCardDTO.getExpiryMonth());
        card.setExpiryYear(paymentCardDTO.getExpiryYear());
        card.setCvv(paymentCardDTO.getCvv());
    }

    private void addCardToUserPaymentsList(User user, PaymentCard card) {
        List<PaymentCard> userCardsList = user.getPaymentCards();
        userCardsList.add(card);
        user.setPaymentCards(userCardsList);
    }

    private void removeCardFromUserPaymentsList(User user, Long cardId) {
        user.getPaymentCards().removeIf(card -> card.getCardId().equals(cardId));
        userDAO.save(user);
    }

    private void updateUserCardsList(User user, PaymentCard updatedCard, Long cardId) {
        user.getPaymentCards().removeIf(card -> card.getCardId().equals(cardId));
        user.getPaymentCards().add(updatedCard);
        userDAO.save(user);
    }

    private void validateCardBelongsToUser(PaymentCard card, User user) {
        if (!card.getUser().getUserId().equals(user.getUserId())) {
            throw new APIException("Card does not belong to user");
        }
    }

    private void unsetAllDefaultCards(User user) {
        user.getPaymentCards().forEach(card -> {
            if (isCardDefault(card)) {
                card.setIsDefault(false);
                paymentCardDAO.save(card);
            }
        });
    }

    private boolean isCardDefault(PaymentCard card) {
        return card.getIsDefault() != null && card.getIsDefault();
    }

    private String buildDeletionMessage(Long cardId) {
        return "Payment card deleted successfully with cardId: " + cardId;
    }
}
