import api from "../../api/api"

export const loadCatalogItems = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "LOAD_CATALOG_ITEMS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};


export const loadCategoryList = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "LOAD_CATEGORY_LIST",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};


export const addItemToCart = (data, qty = 1, toast) =>
    (dispatch, getState) => {
        // Find the product
        const { catalogItems } = getState().catalog;
        const getProduct = catalogItems.find(
            (item) => item.productId === data.productId
        );

        // Check for stocks
        const isQuantityExist = getProduct.quantity >= qty;

        // If in stock -> add
        if (isQuantityExist) {
            dispatch({ type: "ADD_ITEM_TO_CART", payload: {...data, quantity: qty}});
            toast.success(`${data?.productName} added to the cart`);
            localStorage.setItem("cartItems", JSON.stringify(getState().cart.items));
        } else {
            // error
            toast.error("Out of stock");
        }
};


export const increaseCartItemQuantity =
    (data, toast, currentQuantity, setCurrentQuantity) =>
    (dispatch, getState) => {
        // Find the product
        const { catalogItems } = getState().catalog;

        // Check if catalogItems exists and is an array
        if (!catalogItems || !Array.isArray(catalogItems)) {
            // If catalog not loaded, just increase quantity without stock check
            const newQuantity = currentQuantity + 1;
            setCurrentQuantity(newQuantity);
            dispatch({
                type: "ADD_ITEM_TO_CART",
                payload: {...data, quantity: newQuantity },
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().cart.items));
            return;
        }

        const getProduct = catalogItems.find(
            (item) => item.productId === data.productId
        );

        const isQuantityExist = getProduct && getProduct.quantity >= currentQuantity + 1;

        if (isQuantityExist) {
            const newQuantity = currentQuantity + 1;
            setCurrentQuantity(newQuantity);

            dispatch({
                type: "ADD_ITEM_TO_CART",
                payload: {...data, quantity: newQuantity },
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().cart.items));
        } else {
            toast.error("Quantity Reached to Limit");
        }

    };



export const decreaseCartItemQuantity =
    (data, newQuantity) => (dispatch, getState) => {
        dispatch({
            type: "ADD_ITEM_TO_CART",
            payload: {...data, quantity: newQuantity},
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().cart.items));
    }

export const removeItemFromCart =  (data, toast) => (dispatch, getState) => {
    dispatch({type: "REMOVE_ITEM_FROM_CART", payload: data });
    toast.success(`${data.productName} removed from cart`);
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.items));
}


export const authenticateUserLogin
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signin", sendData);
            dispatch({ type: "AUTHENTICATE_USER", payload: data });
            localStorage.setItem("auth", JSON.stringify(data));
            reset();

            // Fetch user's cart from backend after login
            await dispatch(loadUserCartData());

            toast.success("Login Success");
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
        } finally {
            setLoader(false);
        }
}


export const registerNewUser
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};

export const updateUserDisplayName = (username, toast, setIsEditing) => async (dispatch, getState) => {
    try {
        dispatch({ type: "BUTTON_LOADER" });
        const { data } = await api.put("/auth/user/username", { username });

        // Update user in Redux state
        const { currentUser } = getState().authentication;
        const updatedUser = { ...currentUser, username };
        dispatch({ type: "AUTHENTICATE_USER", payload: updatedUser });

        // Update localStorage
        localStorage.setItem("auth", JSON.stringify(updatedUser));

        toast.success(data?.message || "Username updated successfully");
        setIsEditing(false);
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to update username");
        dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message });
    }
};

export const performUserLogout = (navigate) => async (dispatch, getState) => {
    try {
        const { items } = getState().cart;

        // Sync cart to backend before logout if cart exists
        if (items && items.length > 0) {
            const cartItems = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
            await api.post('/cart/create', cartItems);
        }

        dispatch({ type: "USER_LOGOUT" });
        dispatch({ type: "EMPTY_CART" });
        dispatch({ type: "CLEAR_PAYMENT_SELECTION" });
        localStorage.removeItem("auth");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("CHECKOUT_ADDRESS");
        localStorage.removeItem("CHECKOUT_PAYMENT_CARD");
        navigate("/login");
    } catch (error) {
        console.log(error);
        // Still logout even if cart sync fails
        dispatch({ type: "USER_LOGOUT" });
        dispatch({ type: "EMPTY_CART" });
        dispatch({ type: "CLEAR_PAYMENT_SELECTION" });
        localStorage.removeItem("auth");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("CHECKOUT_ADDRESS");
        localStorage.removeItem("CHECKOUT_PAYMENT_CARD");
        navigate("/login");
    }
};

export const saveUserAddressData =
     (sendData, toast, addressId, setOpenAddressModal) => async (dispatch, getState) => {
    /*
    const { currentUser } = getState().authentication;
    await api.post(`/addresses`, sendData, {
          headers: { Authorization: "Bearer " + currentUser.jwtToken },
        });
    */
    dispatch({ type:"BUTTON_LOADER" });
    try {
        if (!addressId) {
            const { data } = await api.post("/addresses", sendData);
        } else {
            await api.put(`/addresses/${addressId}`, sendData);
        }
        dispatch(fetchUserAddressList());
        toast.success("Address saved successfully");
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        dispatch({ type:"IS_ERROR", payload: null });
    } finally {
        setOpenAddressModal(false);
    }
};


export const removeUserAddress =
    (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        dispatch({ type: "BUTTON_LOADER" });
        await api.delete(`/addresses/${addressId}`);
        dispatch({ type: "IS_SUCCESS" });
        dispatch(fetchUserAddressList());
        dispatch(resetCheckoutAddress());
        toast.success("Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Some Error Occured",
         });
    } finally {
        setOpenDeleteModal(false);
    }
};

export const resetCheckoutAddress = () => {
    return {
        type: "CLEAR_CHECKOUT_ADDRESS",
    }
};

export const fetchUserAddressList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/addresses`);
        dispatch({type: "LOAD_USER_ADDRESSES", payload: data});
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch user addresses",
         });
    }
};

export const setCheckoutDeliveryAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));

    return {
        type: "SET_CHECKOUT_ADDRESS",
        payload: address,
    }
};


export const addPaymentMethod = (method) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: method,
    }
};

// Payment Card Actions
export const getUserPaymentCards = () => async (dispatch, getState) => {
    try {
        const { data } = await api.get(`/users/payment-cards`);
        dispatch({ type: "USER_PAYMENT_CARDS", payload: data || [] });
    } catch (error) {
        console.log(error);
        dispatch({ type: "USER_PAYMENT_CARDS", payload: [] });
    }
};

export const addUpdateUserPaymentCard =
    (sendData, toast, cardId, setOpenCardModal) => async (dispatch, getState) => {
    dispatch({ type: "BUTTON_LOADER" });
    try {
        if (!cardId) {
            await api.post("/payment-cards", sendData);
        } else {
            await api.put(`/payment-cards/${cardId}`, sendData);
        }
        dispatch(getUserPaymentCards());
        toast.success("Payment card saved successfully");
        dispatch({ type: "IS_SUCCESS" });
        setOpenCardModal(false);
    } catch (error) {
        console.log(error);
        const errorMessage = error?.response?.status === 401
            ? "You are not authorized. Please log in again."
            : error?.response?.data?.message || "Failed to save payment card. Please check your details.";
        toast.error(errorMessage);
        dispatch({ type: "IS_ERROR", payload: null });
    }
};

export const deleteUserPaymentCard =
    (toast, cardId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        dispatch({ type: "BUTTON_LOADER" });
        await api.delete(`/payment-cards/${cardId}`);
        dispatch({ type: "IS_SUCCESS" });
        dispatch(getUserPaymentCards());
        dispatch(clearPaymentSelection());
        toast.success("Payment card deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Some Error Occurred",
        });
    } finally {
        setOpenDeleteModal(false);
    }
};

export const setDefaultPaymentCard = (cardId, toast) => async (dispatch) => {
    try {
        await api.put(`/payment-cards/${cardId}/set-default`);
        dispatch(getUserPaymentCards());
        toast.success("Default card updated");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to set default card");
    }
};

export const selectPaymentCard = (card) => {
    localStorage.setItem("CHECKOUT_PAYMENT_CARD", JSON.stringify(card));
    return {
        type: "SELECT_PAYMENT_CARD",
        payload: card,
    };
};

export const selectPaymentMethod = (method) => {
    return {
        type: "SELECT_PAYMENT_METHOD",
        payload: method,
    };
};

export const setNewCardDetails = (details) => {
    return {
        type: "SET_NEW_CARD_DETAILS",
        payload: details,
    };
};

export const clearPaymentSelection = () => {
    localStorage.removeItem("CHECKOUT_PAYMENT_CARD");
    return {
        type: "CLEAR_PAYMENT_SELECTION",
    };
};


export const initializeUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(loadUserCartData());
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
         });
    }
};


export const loadUserCartData = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');

        dispatch({
            type: "LOAD_USER_CART_ITEMS",
            payload: data.products,
            totalAmount: data.totalPrice,
            basketId: data.cartId
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().cart.items));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);

        // If no cart on backend, use localStorage cart (for guest users)
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            const cartItems = JSON.parse(storedCart);
            dispatch({
                type: "LOAD_USER_CART_ITEMS",
                payload: cartItems,
                totalAmount: cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0),
                basketId: null
            });
            dispatch({ type: "IS_SUCCESS" });
        } else {
            dispatch({
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Failed to fetch cart items",
            });
        }
    }
};

export const syncCartForCheckout = (navigate, toast) => async (dispatch, getState) => {
    try {
        const { currentUser } = getState().authentication;
        const { items } = getState().cart;

        // Check if user is logged in
        if (!currentUser) {
            toast.error("Please login to proceed to checkout");
            navigate("/login");
            return;
        }

        // Check if cart is empty
        if (!items || items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        dispatch({ type: "IS_FETCHING" });

        // Format cart items for backend
        const cartItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        // Sync cart to backend
        await api.post('/cart/create', cartItems);

        // Fetch the updated cart from backend to ensure sync
        await dispatch(loadUserCartData());

        dispatch({ type: "IS_SUCCESS" });

        // Navigate to checkout
        navigate("/checkout");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to sync cart");
        dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message });
    }
};


export const submitUserOrder
    = (sendData, navigate, toast) => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" });
            const response = await api.post("/order/users/place-order", sendData);
            if (response.data) {
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("CHECKOUT_PAYMENT_CARD");
                localStorage.removeItem("cartItems");
                dispatch({ type: "RESET_PAYMENT_DATA"});
                dispatch({ type: "EMPTY_CART"});
                dispatch({ type: "CLEAR_PAYMENT_SELECTION" });
                toast.success("Order placed successfully!");
                navigate("/order-confirm");
            }
            dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to place order");
            dispatch({ type: "IS_ERROR" });
        }
};

export const analyticsAction = () => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING"});
            const { data } = await api.get('/admin/app/analytics');
            dispatch({
                type: "FETCH_ANALYTICS",
                payload: data,
            })
            dispatch({ type: "IS_SUCCESS"});
        } catch (error) {
            dispatch({ 
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Failed to fetch analytics data",
            });
        }
};

export const getOrdersForDashboard = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/admin/orders?${queryString}`);
        dispatch({
            type: "GET_ADMIN_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders data",
         });
    }
};



export const updateOrderStatusFromDashboard =
     (orderId, orderStatus, toast, setLoader) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const { data } = await api.put(`/admin/orders/${orderId}/status`, { status: orderStatus});
        toast.success(data.message || "Order updated successfully");
        await dispatch(getOrdersForDashboard());
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
        setLoader(false)
    }
};


export const getUserOrders = (pageNumber = 0, pageSize = 10) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(
            `/orders/users?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=orderId&sortOrder=desc`
        );
        dispatch({
            type: "GET_USER_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders"
        });
    }
};


export const loadDashboardCatalog = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/admin/products?${queryString}`);
        dispatch({
            type: "LOAD_CATALOG_ITEMS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch dashboard products",
         });
    }
};


export const modifyDashboardProduct =
    (sendData, toast, reset, setLoader, setOpen) => async (dispatch) => {
    try {
        setLoader(true);
        await api.put(`/admin/products/${sendData.id}`, sendData);
        toast.success("Product update successful");
        reset();
        setLoader(false);
        setOpen(false);
        await dispatch(loadDashboardCatalog());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Product update failed");

    }
};



export const createDashboardProduct =
    (sendData, toast, reset, setLoader, setOpen) => async(dispatch, getState) => {
        try {
            setLoader(true);
            await api.post(`/admin/categories/${sendData.categoryId}/product`,
                sendData
            );
            toast.success("Product created successfully");
            reset();
            setOpen(false);
            await dispatch(loadDashboardCatalog());
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.description || "Product creation failed");
        } finally {
            setLoader(false);
        }
    }

export const removeCatalogItem =
    (setLoader, productId, toast, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        setLoader(true)
        await api.delete(`/admin/products/${productId}`);
        toast.success("Product deleted successfully");
        setLoader(false);
        setOpenDeleteModal(false);
        await dispatch(loadDashboardCatalog());
    } catch (error) {
        console.log(error);
        toast.error(
            error?.response?.data?.message || "Some Error Occured"
        )
    }
};


export const uploadProductImageDashboard =
    (formData, productId, toast, setLoader, setOpen) => async (dispatch) => {
    try {
        setLoader(true);
        await api.put(`/admin/products/${productId}/image`, formData);
        toast.success("Image upload successful");
        setLoader(false);
        setOpen(false);
        await dispatch(loadDashboardCatalog());
    } catch (error) {
        toast.error(error?.response?.data?.description || "Product Image upload failed");

    }
};

export const fetchAllDashboardCategories = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "LOAD_CATEGORY_LIST",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    console.log(err);

    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const addNewCategoryDashboard =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      await dispatch(fetchAllDashboardCategories());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const modifyDashboardCategory =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      await dispatch(fetchAllDashboardCategories());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const removeDashboardCategory =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      await dispatch(fetchAllDashboardCategories());
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };


// Customer Management Actions
export const getAllCustomersDashboard = (queryString) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/auth/customers?${queryString}`);
    dispatch({
      type: "GET_CUSTOMERS",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (err) {
    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch customers",
    });
  }
};

export const getCustomerDetails = (userId) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });

    // Fetch addresses, payment cards, and orders in parallel
    const [addressesRes, cardsRes, ordersRes] = await Promise.all([
      api.get(`/admin/addresses/user/${userId}`),
      api.get(`/admin/payment-cards/user/${userId}`),
      api.get(`/admin/orders/user/${userId}?pageNumber=0&pageSize=10&sortBy=orderId&sortOrder=desc`)
    ]);

    dispatch({
      type: "SET_CUSTOMER_DETAILS",
      payload: {
        addresses: addressesRes.data,
        paymentCards: cardsRes.data,
        orders: ordersRes.data.content
      }
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (err) {
    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch customer details",
    });
  }
};