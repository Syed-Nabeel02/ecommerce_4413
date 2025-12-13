const initialState = {
    adminOrder: null,
    orders: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1,
    lastPage: false,
    isLoading: false,
    error: null,
    pagination: {},
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "IS_FETCHING":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case "GET_ADMIN_ORDERS":
            return {
                ...state,
                adminOrder: action.payload,
                orders: action.payload,
                pageNumber: action.pageNumber,
                pageSize: action.pageSize,
                totalElements: action.totalElements,
                totalPages: action.totalPages,
                lastPage: action.lastPage,
                pagination: {
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
                isLoading: false,
            };
        case "GET_USER_ORDERS":
            return {
                ...state,
                orders: action.payload,
                pageNumber: action.pageNumber,
                pageSize: action.pageSize,
                totalElements: action.totalElements,
                totalPages: action.totalPages,
                lastPage: action.lastPage,
                pagination: {
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
                isLoading: false,
            };
        case "IS_SUCCESS":
            return {
                ...state,
                isLoading: false,
            };
        case "IS_ERROR":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};