package com.ecommerce.project.service;

import org.springframework.stereotype.Service;

import com.ecommerce.project.DAO.OrderDAO;
import com.ecommerce.project.DAO.ProductDAO;
import com.ecommerce.project.DTO.AnalyticsResponse;
import com.ecommerce.project.service.Interface.IAnalyticsService;

@Service
public class IAnalyticsServiceImpl implements IAnalyticsService {

    private final ProductDAO productDAO;
    private final OrderDAO orderDAO;

    public IAnalyticsServiceImpl(ProductDAO productDAO, OrderDAO orderDAO) {
        this.productDAO = productDAO;
        this.orderDAO = orderDAO;
    }

    @Override
    public AnalyticsResponse getAnalyticsData() {
        long productCount = calculateProductCount();
        long totalOrders = calculateTotalOrders();
        Double totalRevenue = calculateTotalRevenue();

        return buildAnalyticsResponse(productCount, totalOrders, totalRevenue);
    }

    private long calculateProductCount() {
        return productDAO.count();
    }

    private long calculateTotalOrders() {
        return orderDAO.count();
    }

    private Double calculateTotalRevenue() {
        return orderDAO.calculateTotalRevenue();
    }

    private AnalyticsResponse buildAnalyticsResponse(long productCount, long totalOrders, Double totalRevenue) {
        AnalyticsResponse analyticsResponse = new AnalyticsResponse();

        analyticsResponse.setProductCount(String.valueOf(productCount));
        analyticsResponse.setTotalOrders(String.valueOf(totalOrders));
        analyticsResponse.setTotalRevenue(formatRevenue(totalRevenue));

        return analyticsResponse;
    }

    private String formatRevenue(Double revenueValue) {
        return String.valueOf(revenueValue != null ? revenueValue : 0);
    }
}
