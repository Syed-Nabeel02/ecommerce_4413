package com.ecommerce.project.service.Interface;

import com.ecommerce.project.DTO.OrderDTO;
import com.ecommerce.project.DTO.OrderResponse;
import jakarta.transaction.Transactional;

public interface IOrderService {
    @Transactional
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);

    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    OrderDTO updateOrder(Long orderId, String status);

    OrderResponse getUserOrders(String emailId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    OrderResponse getUserOrdersByUserId(Long userId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

}
