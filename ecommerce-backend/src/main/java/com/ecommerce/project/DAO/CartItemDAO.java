package com.ecommerce.project.DAO;

import com.ecommerce.project.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CartItemDAO extends JpaRepository<CartItem, Long> {

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartIdentifier AND ci.product.id = :productIdentifier")
    CartItem retrieveCartItemByProductAndCart(@Param("cartIdentifier") Long cartIdentifier, @Param("productIdentifier") Long productIdentifier);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartIdentifier AND ci.product.id = :productIdentifier")
    void removeCartItemByProductAndCart(@Param("cartIdentifier") Long cartIdentifier, @Param("productIdentifier") Long productIdentifier);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartIdentifier")
    void removeAllItemsByCart(@Param("cartIdentifier") Long cartIdentifier);
}