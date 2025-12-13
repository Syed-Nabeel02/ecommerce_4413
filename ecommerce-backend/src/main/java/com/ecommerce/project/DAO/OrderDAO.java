package com.ecommerce.project.DAO;

import com.ecommerce.project.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderDAO extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.email = :userEmailAddress")
    Page<Order> fetchOrdersByUserEmail(@Param("userEmailAddress") String userEmailAddress, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o")
    Double calculateTotalRevenue();
}