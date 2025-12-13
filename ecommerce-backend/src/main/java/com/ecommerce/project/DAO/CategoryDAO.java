package com.ecommerce.project.DAO;

import com.ecommerce.project.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryDAO extends JpaRepository<Category,Long> {
    Category findByCategoryName(String categoryName);
}
