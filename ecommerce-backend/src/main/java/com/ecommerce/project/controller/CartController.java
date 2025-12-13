package com.ecommerce.project.controller;

import com.ecommerce.project.model.Cart;
import com.ecommerce.project.DTO.CartDTO;
import com.ecommerce.project.DTO.CartItemDTO;
import com.ecommerce.project.DAO.CartDAO;
import com.ecommerce.project.service.Interface.ICartService;
import com.ecommerce.project.helper.AuthHelper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CartController {

    private final CartDAO cartDAO;
    private final AuthHelper authHelper;
    private final ICartService ICartService;


    public CartController(CartDAO cartDAO, AuthHelper authHelper, ICartService ICartService) {
        this.cartDAO = cartDAO;
        this.authHelper = authHelper;
        this.ICartService = ICartService;
    }

    @PostMapping("/cart/create")
    public ResponseEntity<?> createOrUpdateCart(@RequestBody List<CartItemDTO> cartItems) {
        String result = ICartService.createOrUpdateCartWithItems(cartItems);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/carts/products/{productId}/quantity/{quantity}")
    public ResponseEntity<?> addProductToCart(@PathVariable Long productId, @PathVariable Integer quantity) {
        CartDTO cartData = ICartService.addProductToCart(productId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).body(cartData);
    }

    @GetMapping("/carts")
    public ResponseEntity<?> getCarts() {
        List<CartDTO> allCarts = ICartService.getAllCarts();
        return ResponseEntity.ok(allCarts);
    }

    @GetMapping("/carts/users/cart")
    public ResponseEntity<?> getCartById() {
        String userEmail = authHelper.loggedInEmail();
        Cart userCart = cartDAO.fetchCartByUserEmail(userEmail);
        Long userCartId = userCart.getCartId();
        CartDTO userCartData = ICartService.getCart(userEmail, userCartId);
        return ResponseEntity.ok(userCartData);
    }

    @PutMapping("/cart/products/{productId}/quantity/{operation}")
    public ResponseEntity<?> updateCartProduct(@PathVariable Long productId, @PathVariable String operation) {
        int quantityModifier = operation.equalsIgnoreCase("delete") ? -1 : 1;
        CartDTO updatedCart = ICartService.updateProductQuantityInCart(productId, quantityModifier);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/carts/{cartId}/product/{productId}")
    public ResponseEntity<?> deleteProductFromCart(@PathVariable Long cartId, @PathVariable Long productId) {
        String deleteStatus = ICartService.deleteProductFromCart(cartId, productId);
        return ResponseEntity.ok(deleteStatus);
    }
}
