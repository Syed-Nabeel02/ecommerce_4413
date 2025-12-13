const initialState = {
  customers: null,
  pagination: {},
  selectedCustomerDetails: null,
};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CUSTOMERS":
      return {
        ...state,
        customers: action.payload,
        pagination: {
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        },
      };
    case "SET_CUSTOMER_DETAILS":
      return {
        ...state,
        selectedCustomerDetails: action.payload,
      };
    default:
      return state;
  }
};
