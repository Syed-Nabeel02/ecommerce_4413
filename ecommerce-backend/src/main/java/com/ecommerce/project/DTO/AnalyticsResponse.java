package com.ecommerce.project.DTO;

public class AnalyticsResponse {
    private String productCount;
    private String totalRevenue;
    private String totalOrders;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(String productCount, String totalRevenue, String totalOrders) {
        this.productCount = productCount;
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
    }

    public String getProductCount() {
        return productCount;
    }

    public void setProductCount(String productCount) {
        this.productCount = productCount;
    }

    public String getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(String totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public String getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(String totalOrders) {
        this.totalOrders = totalOrders;
    }
}
