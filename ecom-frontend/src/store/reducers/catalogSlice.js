const initialState = {
    catalogItems: null,
    categoryList: null,
    pageInfo: {},
};

export const catalogReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_CATALOG_ITEMS":
            return {
                ...state,
                catalogItems: action.payload,
                pageInfo: {
                    ...state.pageInfo,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "LOAD_CATEGORY_LIST":
            return {
                ...state,
                categoryList: action.payload,
                pageInfo: {
                    ...state.pageInfo,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };


        default:
            return state;
    }
};
