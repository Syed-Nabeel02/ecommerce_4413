package com.ecommerce.project.service.Interface;

import com.ecommerce.project.DTO.CartDTO;
import com.ecommerce.project.DTO.CartItemDTO;
import jakarta.transaction.Transactional;

import java.util.List;

public interface ICartService {
    CartDTO addProductToCart(Long productId, Integer quantity);

    List<CartDTO> getAllCarts();

    CartDTO getCart(String emailId, Long cartId);

    @Transactional
    CartDTO updateProductQuantityInCart(Long productId, Integer quantity);

    String deleteProductFromCart(Long cartId, Long productId);

    void updateProductInCarts(Long cartId, Long productId);

    String createOrUpdateCartWithItems(List<CartItemDTO> cartItems);
}
