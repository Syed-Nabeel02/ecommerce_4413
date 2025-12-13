package com.ecommerce.project.DAO;

import com.ecommerce.project.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartDAO extends JpaRepository<Cart, Long> {

    @Query("SELECT c FROM Cart c WHERE c.user.email = :userEmail")
    Cart fetchCartByUserEmail(@Param("userEmail") String userEmail);

    @Query("SELECT c FROM Cart c WHERE c.user.email = :userEmail AND c.id = :cartIdentifier")
    Cart fetchCartByUserEmailAndId(@Param("userEmail") String userEmail, @Param("cartIdentifier") Long cartIdentifier);

    @Query("SELECT DISTINCT c FROM Cart c INNER JOIN FETCH c.cartItems ci INNER JOIN FETCH ci.product p WHERE p.id = :productIdentifier")
    List<Cart> retrieveCartsByProduct(@Param("productIdentifier") Long productIdentifier);
}
