package com.ecommerce.project.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }

    public static final String page_num = "0";
    public static final String page_size = "10";
    public static final String category_sortBy = "categoryId";
    public static final String products_sortBy = "productId";
    public static final String sort_order = "asc";
    public static final String orders_sort_by = "totalAmount";
    public static final String users_sort_by = "userId";
}
