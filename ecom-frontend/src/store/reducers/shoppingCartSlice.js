const initialState = {
    items: [],
    totalAmount: 0,
    basketId: null,
}

export const shoppingCartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_ITEM_TO_CART":
            const itemToAdd = action.payload;
            const existingItem = state.items.find(
                (item) => item.productId === itemToAdd.productId
            );

            if(existingItem) {
                const updatedItems = state.items.map((item) => {
                    if (item.productId === itemToAdd.productId) {
                        return itemToAdd;
                    } else {
                        return item;
                    }
                });

                return {
                    ...state,
                    items: updatedItems,
                };
            } else {
                const newItems = [...state.items, itemToAdd];
                return {
                    ...state,
                    items: newItems,
                };
            }
        case "REMOVE_ITEM_FROM_CART":
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.productId !== action.payload.productId
                ),
            };
        case "LOAD_USER_CART_ITEMS":
            return {
                ...state,
                items: action.payload,
                totalAmount: action.totalAmount,
                basketId: action.basketId,
            };
        case "EMPTY_CART":
            return { items:[], totalAmount: 0, basketId: null};
        default:
            return state;
    }
    return state;
}
