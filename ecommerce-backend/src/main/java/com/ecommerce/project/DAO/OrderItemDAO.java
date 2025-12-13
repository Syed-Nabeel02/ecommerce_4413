package com.ecommerce.project.DAO;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.project.model.OrderItem;

@Repository
public interface OrderItemDAO extends JpaRepository<OrderItem, Long> {

}
