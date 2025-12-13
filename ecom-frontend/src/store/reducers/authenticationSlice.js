const initialState = {
    currentUser: null,
    userAddresses: [],
    paymentClientSecret: null,
    checkoutAddress: null,
}

export const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "AUTHENTICATE_USER":
            return { ...state, currentUser: action.payload };
        case "LOAD_USER_ADDRESSES":
            return { ...state, userAddresses: action.payload };
        case "SET_CHECKOUT_ADDRESS":
            return { ...state, checkoutAddress: action.payload };
        case "CLEAR_CHECKOUT_ADDRESS":
            return { ...state, checkoutAddress: null };
        case "SET_PAYMENT_SECRET":
            return { ...state, paymentClientSecret: action.payload };
        case "RESET_PAYMENT_DATA":
            return { ...state, paymentClientSecret: null, checkoutAddress: null };
        case "USER_LOGOUT":
            return {
                currentUser: null,
                userAddresses: null,
             };

        default:
            return state;
    }
};
