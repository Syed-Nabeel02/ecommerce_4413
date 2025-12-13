package com.ecommerce.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.project.DTO.*;
import com.ecommerce.project.config.Constants;
import com.ecommerce.project.helper.AuthHelper;
import com.ecommerce.project.service.Interface.IOrderService;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final IOrderService IOrderService;
    private final AuthHelper authHelper;

    public OrderController(IOrderService IOrderService, AuthHelper authHelper) {
        this.IOrderService = IOrderService;
        this.authHelper = authHelper;
    }

    @PostMapping("/order/users/place-order")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        String userEmail = authHelper.loggedInEmail();

        String paymentMethodValue = orderRequestDTO.getPaymentMethod() != null
                ? orderRequestDTO.getPaymentMethod()
                : "Cash on Delivery";

        String pgNameValue = orderRequestDTO.getPgName() != null
                ? orderRequestDTO.getPgName()
                : "None";

        String pgPaymentIdValue = orderRequestDTO.getPgPaymentId() != null
                ? orderRequestDTO.getPgPaymentId()
                : "N/A";

        String pgStatusValue = orderRequestDTO.getPgStatus() != null
                ? orderRequestDTO.getPgStatus()
                : "Pending";

        String pgResponseMessageValue = orderRequestDTO.getPgResponseMessage() != null
                ? orderRequestDTO.getPgResponseMessage()
                : "Order placed successfully";

        OrderDTO createdOrder = IOrderService.placeOrder(
                userEmail,
                orderRequestDTO.getAddressId(),
                paymentMethodValue,
                pgNameValue,
                pgPaymentIdValue,
                pgStatusValue,
                pgResponseMessageValue
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.orders_sort_by, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder
    ) {
        OrderResponse allOrdersData = IOrderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(allOrdersData);
    }

    @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusUpdateDto orderStatusUpdateDto) {
        OrderDTO modifiedOrder = IOrderService.updateOrder(orderId, orderStatusUpdateDto.getStatus());
        return ResponseEntity.ok(modifiedOrder);
    }

    @GetMapping("/orders/users")
    public ResponseEntity<?> getUserOrders(
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.orders_sort_by, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder
    ) {
        String userEmail = authHelper.loggedInEmail();
        OrderResponse userOrdersData = IOrderService.getUserOrders(userEmail, pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(userOrdersData);
    }

    @GetMapping("/admin/orders/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.orders_sort_by, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder
    ) {
        OrderResponse userOrdersByIdData = IOrderService.getUserOrdersByUserId(userId, pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(userOrdersByIdData);
    }
}
