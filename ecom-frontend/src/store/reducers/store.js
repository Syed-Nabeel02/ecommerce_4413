import { configureStore } from "@reduxjs/toolkit";
import { catalogReducer } from "./catalogSlice";
import { errorReducer } from "./errorReducer";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { authenticationReducer } from "./authenticationSlice";
import { paymentMethodReducer } from "./paymentMethodReducer";
import { adminReducer } from "./adminReducer";
import { orderReducer } from "./orderReducer";
import { customerReducer } from "./customerReducer";

const currentUser = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

const basketItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const savedCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
    ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
    : [];

const selectedPaymentCard = localStorage.getItem("CHECKOUT_PAYMENT_CARD")
    ? JSON.parse(localStorage.getItem("CHECKOUT_PAYMENT_CARD"))
    : null;

const initialState = {
    authentication: { currentUser: currentUser, checkoutAddress: savedCheckoutAddress },
    cart: { items: basketItems },
    payment: { selectedPaymentCard },
};

export const store = configureStore({
    reducer: {
        catalog: catalogReducer,
        errors: errorReducer,
        cart: shoppingCartReducer,
        authentication: authenticationReducer,
        payment: paymentMethodReducer,
        admin: adminReducer,
        order: orderReducer,
        customer: customerReducer,
    },
    preloadedState: initialState,
});

export default store;