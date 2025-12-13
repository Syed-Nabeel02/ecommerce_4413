package com.ecommerce.project.controller;

import com.ecommerce.project.DTO.AnalyticsResponse;
import com.ecommerce.project.service.Interface.IAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    private final IAnalyticsService IAnalyticsService;

    public AnalyticsController(IAnalyticsService IAnalyticsService) {
        this.IAnalyticsService = IAnalyticsService;
    }

    @GetMapping("/admin/app/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        AnalyticsResponse response = IAnalyticsService.getAnalyticsData();
        return ResponseEntity.ok(response);
    }
}