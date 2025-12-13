package com.ecommerce.project.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.project.service.Interface.ICategoryService;
import com.ecommerce.project.DTO.CategoryDTO;
import com.ecommerce.project.DTO.CategoryResponse;
import com.ecommerce.project.config.Constants;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final ICategoryService ICategoryService;

    public CategoryController(ICategoryService ICategoryService) {
        this.ICategoryService = ICategoryService;
    }

    @GetMapping("/public/categories")
    public ResponseEntity<?> getAllCategories(
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.category_sortBy, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder) {
        CategoryResponse categoryList = ICategoryService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(categoryList);
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO newCategory = ICategoryService.createCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }

    @DeleteMapping("/admin/categories/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) {
        CategoryDTO removedCategory = ICategoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(removedCategory);
    }

    @PutMapping("/admin/categories/{categoryId}")
    public ResponseEntity<?> updateCategory(@Valid @RequestBody CategoryDTO categoryDTO, @PathVariable Long categoryId) {
        CategoryDTO modifiedCategory = ICategoryService.updateCategory(categoryDTO, categoryId);
        return ResponseEntity.ok(modifiedCategory);
    }
}
