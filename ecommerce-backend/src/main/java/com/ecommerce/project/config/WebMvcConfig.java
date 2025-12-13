package com.ecommerce.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Legacy: Serve local images for backwards compatibility
        // New images are uploaded to Cloudinary and served via CDN
        registry.addResourceHandler("/images/**").addResourceLocations("file:images/");
    }
}
