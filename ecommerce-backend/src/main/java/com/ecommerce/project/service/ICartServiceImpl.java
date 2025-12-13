// Cart service - handles all shopping cart operations like adding items, updating quantities, etc.
package com.ecommerce.project.service;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.ecommerce.project.DAO.CartDAO;
import com.ecommerce.project.DAO.CartItemDAO;
import com.ecommerce.project.DAO.ProductDAO;
import com.ecommerce.project.DTO.CartDTO;
import com.ecommerce.project.DTO.CartItemDTO;
import com.ecommerce.project.DTO.ProductDTO;
import com.ecommerce.project.errorHandler.APIException;
import com.ecommerce.project.errorHandler.ResourceNotFoundException;
import com.ecommerce.project.helper.AuthHelper;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.CartItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.service.Interface.ICartService;

@Service
@Transactional
public class ICartServiceImpl implements ICartService {

    // Database access objects
    private final CartDAO cartDAO;
    private final CartItemDAO cartItemDAO;
    private final ProductDAO productDAO;

    // Helper for mapping objects
    private final ModelMapper modelMapper;

    // Helper for getting logged-in user info
    private final AuthHelper authHelper;

    // Constructor - Spring automatically injects these dependencies
    public ICartServiceImpl(CartDAO cartDAO, CartItemDAO cartItemDAO, ProductDAO productDAO,
                            ModelMapper modelMapper, AuthHelper authHelper) {
        this.cartDAO = cartDAO;
        this.cartItemDAO = cartItemDAO;
        this.productDAO = productDAO;
        this.modelMapper = modelMapper;
        this.authHelper = authHelper;
    }

    // Add a product to the current user's cart
    @Override
    public CartDTO addProductToCart(Long productId, Integer quantity) {
        // Get or create cart for logged-in user
        Cart shoppingCart = createOrFetchUserCart();

        // Find the product
        Product selectedProduct = fetchProductOrThrowException(productId);

        // Check if product is already in cart
        validateProductNotInCart(shoppingCart.getCartId(), productId, selectedProduct);

        // Check if we have enough stock
        validateProductAvailability(selectedProduct, quantity);

        // Create cart item and save it
        CartItem newEntry = createCartItem(selectedProduct, shoppingCart, quantity);
        cartItemDAO.save(newEntry);

        // Update cart total price
        shoppingCart.setTotalPrice(shoppingCart.getTotalPrice() +
                (selectedProduct.getPrice() * quantity));
        cartDAO.save(shoppingCart);

        // Return cart as DTO
        return buildCartDTOWithProducts(shoppingCart);
    }

    // Get all carts in the system (admin function)
    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> allCarts = cartDAO.findAll();

        // Throw error if no carts exist
        if (allCarts.isEmpty()) {
            throw new APIException("No cart exists");
        }

        // Convert each cart to DTO and return
        return allCarts.stream()
                .map(this::buildCartDTOWithProducts)
                .collect(Collectors.toList());
    }

    // Get a specific cart by email and cart ID
    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart userCart = fetchCartByEmailAndIdOrThrowException(emailId, cartId);
        return buildCartDTOWithProducts(userCart);
    }

    // Update quantity of a product in cart (can increase or decrease)
    @Override
    public CartDTO updateProductQuantityInCart(Long productId, Integer quantity) {
        // Get current user and their cart
        String currentUserEmail = authHelper.loggedInEmail();
        Cart currentUserCart = fetchCartByEmailOrThrowException(currentUserEmail);

        // Get product and check availability
        Product targetProduct = fetchProductOrThrowException(productId);
        validateProductAvailability(targetProduct, quantity);

        // Get the cart item and calculate new quantity
        CartItem targetItem = fetchCartItemOrThrowException(currentUserCart.getCartId(), productId);
        int updatedQuantity = targetItem.getQuantity() + quantity;

        // Make sure quantity doesn't go negative
        validateQuantityIsNotNegative(updatedQuantity);

        // If quantity is 0, remove item from cart
        if (updatedQuantity == 0) {
            deleteProductFromCart(currentUserCart.getCartId(), productId);
        } else {
            // Update item quantity and cart total
            updateCartItemDetails(targetItem, targetProduct, quantity);
            updateCartTotalPrice(currentUserCart, targetItem.getProductPrice() * quantity);
            cartItemDAO.save(targetItem);
        }

        return buildCartDTOWithProducts(currentUserCart);
    }

    // Remove a product from cart completely
    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        // Find cart and item
        Cart targetCart = fetchCartOrThrowException(cartId);
        CartItem itemToRemove = fetchCartItemOrThrowException(cartId, productId);

        // Update cart total price
        deductFromCartTotalPrice(targetCart, itemToRemove);

        // Delete the item
        cartItemDAO.removeCartItemByProductAndCart(cartId, productId);

        return buildDeletionMessage(itemToRemove.getProduct().getProductName());
    }

    // Update cart item when product price changes
    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        // Get cart, product, and cart item
        Cart targetCart = fetchCartOrThrowException(cartId);
        Product updatedProduct = fetchProductOrThrowException(productId);
        CartItem affectedItem = fetchCartItemOrThrowException(cartId, productId);

        // Calculate price difference
        double priceBeforeUpdate = affectedItem.getProductPrice() * affectedItem.getQuantity();
        affectedItem.setProductPrice(updatedProduct.getPrice());
        double priceAfterUpdate = affectedItem.getProductPrice() * affectedItem.getQuantity();

        // Update cart total
        double recalculatedTotalPrice = targetCart.getTotalPrice() - priceBeforeUpdate + priceAfterUpdate;
        targetCart.setTotalPrice(recalculatedTotalPrice);

        cartItemDAO.save(affectedItem);
    }

    // Create or update cart with items (used for guest cart sync)
    @Override
    public String createOrUpdateCartWithItems(List<CartItemDTO> cartItems) {
        // Get current user and their cart
        String currentUserEmail = authHelper.loggedInEmail();
        Cart availableCart = createOrFetchCartForUser(currentUserEmail);

        // Clear existing items
        clearExistingCartItems(availableCart.getCartId());

        // Add new items and calculate total
        double cumulativePrice = processCartItems(cartItems, availableCart);

        // Update cart total
        availableCart.setTotalPrice(cumulativePrice);
        cartDAO.save(availableCart);

        return "Cart created/updated with the new items successfully";
    }

    // Helper: Get user's cart or create new one if doesn't exist
    private Cart createOrFetchUserCart() {
        Cart existingUserCart = cartDAO.fetchCartByUserEmail(authHelper.loggedInEmail());
        if (existingUserCart != null) {
            return existingUserCart;
        }

        // Create new cart
        Cart newShoppingCart = new Cart();
        newShoppingCart.setTotalPrice(0.00);
        newShoppingCart.setUser(authHelper.loggedInUser());
        return cartDAO.save(newShoppingCart);
    }

    // Helper: Find product by ID or throw error
    private Product fetchProductOrThrowException(Long productId) {
        return productDAO.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    }

    // Helper: Check if product already in cart
    private void validateProductNotInCart(Long cartId, Long productId, Product product) {
        CartItem existingItem = cartItemDAO.retrieveCartItemByProductAndCart(cartId, productId);
        if (existingItem != null) {
            throw new APIException("Product " + product.getProductName() + " already exists in the cart");
        }
    }

    // Helper: Check if product has enough stock
    private void validateProductAvailability(Product product, Integer requestedQuantity) {
        if (product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + " is not available");
        }

        if (product.getQuantity() < requestedQuantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity " + product.getQuantity() + ".");
        }
    }

    // Helper: Create a new cart item
    private CartItem createCartItem(Product product, Cart cart, Integer quantity) {
        CartItem newEntry = new CartItem();
        newEntry.setProduct(product);
        newEntry.setCart(cart);
        newEntry.setQuantity(quantity);
        newEntry.setProductPrice(product.getPrice());
        return newEntry;
    }

    // Helper: Convert cart entity to DTO with product list
    private CartDTO buildCartDTOWithProducts(Cart cart) {
        CartDTO cartDataTransfer = modelMapper.map(cart, CartDTO.class);

        // Map cart items to product DTOs
        List<ProductDTO> productList = cart.getCartItems().stream()
                .map(cartElement -> {
                    ProductDTO mappedProduct = modelMapper.map(cartElement.getProduct(), ProductDTO.class);
                    mappedProduct.setQuantity(cartElement.getQuantity());
                    return mappedProduct;
                })
                .collect(Collectors.toList());

        cartDataTransfer.setProducts(productList);
        return cartDataTransfer;
    }

    // Helper: Find cart by email and ID or throw error
    private Cart fetchCartByEmailAndIdOrThrowException(String emailId, Long cartId) {
        Cart userCart = cartDAO.fetchCartByUserEmailAndId(emailId, cartId);
        if (userCart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        return userCart;
    }

    // Helper: Find cart by email or throw error
    private Cart fetchCartByEmailOrThrowException(String emailId) {
        Cart userCart = cartDAO.fetchCartByUserEmail(emailId);
        if (userCart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", "Not Found");
        }
        return userCart;
    }

    // Helper: Find cart by ID or throw error
    private Cart fetchCartOrThrowException(Long cartId) {
        return cartDAO.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
    }

    // Helper: Find cart item or throw error
    private CartItem fetchCartItemOrThrowException(Long cartId, Long productId) {
        CartItem targetItem = cartItemDAO.retrieveCartItemByProductAndCart(cartId, productId);
        if (targetItem == null) {
            throw new APIException("Product not available in the cart");
        }
        return targetItem;
    }

    // Helper: Make sure quantity is not negative
    private void validateQuantityIsNotNegative(int quantity) {
        if (quantity < 0) {
            throw new APIException("The resulting quantity cannot be negative.");
        }
    }

    // Helper: Update cart item price and quantity
    private void updateCartItemDetails(CartItem cartItem, Product product, Integer quantityChange) {
        cartItem.setProductPrice(product.getPrice());
        cartItem.setQuantity(cartItem.getQuantity() + quantityChange);
    }

    // Helper: Update cart total price
    private void updateCartTotalPrice(Cart cart, double priceAdjustment) {
        cart.setTotalPrice(cart.getTotalPrice() + priceAdjustment);
        cartDAO.save(cart);
    }

    // Helper: Subtract item price from cart total
    private void deductFromCartTotalPrice(Cart cart, CartItem cartItem) {
        cart.setTotalPrice(cart.getTotalPrice() -
                (cartItem.getProductPrice() * cartItem.getQuantity()));
    }

    // Helper: Build success message for deletion
    private String buildDeletionMessage(String productName) {
        return "Product " + productName + " removed from the cart !!!";
    }

    // Helper: Get or create cart for specific user
    private Cart createOrFetchCartForUser(String emailId) {
        Cart availableCart = cartDAO.fetchCartByUserEmail(emailId);
        if (availableCart == null) {
            availableCart = new Cart();
            availableCart.setTotalPrice(0.00);
            availableCart.setUser(authHelper.loggedInUser());
            availableCart = cartDAO.save(availableCart);
        }
        return availableCart;
    }

    // Helper: Remove all items from cart
    private void clearExistingCartItems(Long cartId) {
        cartItemDAO.removeAllItemsByCart(cartId);
    }

    // Helper: Process list of cart items and return total price
    private double processCartItems(List<CartItemDTO> cartItems, Cart availableCart) {
        double cumulativePrice = 0.00;

        // Loop through each item
        for (CartItemDTO itemDTO : cartItems) {
            Long requestedProductId = itemDTO.getProductId();
            Integer requestedQuantity = itemDTO.getQuantity();

            // Get product and add to total
            Product catalogProduct = fetchProductOrThrowException(requestedProductId);
            cumulativePrice += catalogProduct.getPrice() * requestedQuantity;

            // Create and save cart item
            CartItem newCartEntry = createCartItem(catalogProduct, availableCart, requestedQuantity);
            cartItemDAO.save(newCartEntry);
        }

        return cumulativePrice;
    }
}
