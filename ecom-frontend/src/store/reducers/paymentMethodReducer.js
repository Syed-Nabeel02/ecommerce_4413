const initialState = {
    paymentCards: [],
    selectedPaymentCard: null,
    selectedPaymentMethod: null, // "SAVED_CARD", "NEW_CARD", "COD"
    newCardDetails: null,
};

export const paymentMethodReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_PAYMENT_CARDS":
            return {
                ...state,
                paymentCards: action.payload,
            };
        case "SELECT_PAYMENT_CARD":
            return {
                ...state,
                selectedPaymentCard: action.payload,
            };
        case "SELECT_PAYMENT_METHOD":
            return {
                ...state,
                selectedPaymentMethod: action.payload,
            };
        case "SET_NEW_CARD_DETAILS":
            return {
                ...state,
                newCardDetails: action.payload,
            };
        case "CLEAR_PAYMENT_SELECTION":
            return {
                ...state,
                selectedPaymentCard: null,
                selectedPaymentMethod: null,
                newCardDetails: null,
            };
        default:
            return state;
    }
};