package com.ecommerce.project.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.project.DTO.ProductDTO;
import com.ecommerce.project.DTO.ProductResponse;
import com.ecommerce.project.config.Constants;
import com.ecommerce.project.service.Interface.IProductService;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ProductsController {

    private final IProductService IProductService;

    public ProductsController(IProductService IProductService) {
        this.IProductService = IProductService;
    }

    @PostMapping("/admin/categories/{categoryId}/product")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductDTO productDTO,
                                        @PathVariable Long categoryId) {
        ProductDTO createdProduct = IProductService.addProduct(categoryId, productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @GetMapping("/public/products")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.products_sortBy, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder) {
        ProductResponse fetchedProducts = IProductService.getAllProducts(pageNumber, pageSize, sortBy, sortOrder, keyword, category);
        return ResponseEntity.ok(fetchedProducts);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.products_sortBy, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder) {
        ProductResponse categoryProducts = IProductService.searchByCategory(categoryId, pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(categoryProducts);
    }

    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<?> getProductsByKeyword(
            @PathVariable String keyword,
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.products_sortBy, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder) {
        ProductResponse searchResults = IProductService.searchProductByKeyword(keyword, pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(searchResults);
    }

    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<?> updateProduct(@Valid @RequestBody ProductDTO productDTO,
                                           @PathVariable Long productId) {
        ProductDTO modifiedProduct = IProductService.updateProduct(productId, productDTO);
        return ResponseEntity.ok(modifiedProduct);
    }

    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        ProductDTO removedProduct = IProductService.deleteProduct(productId);
        return ResponseEntity.ok(removedProduct);
    }

    @PutMapping("/admin/products/{productId}/image")
    public ResponseEntity<?> updateProductImage(@PathVariable Long productId,
                                                @RequestParam("image") MultipartFile image) throws IOException {
        ProductDTO updatedProductWithImage = IProductService.updateProductImage(productId, image);
        return ResponseEntity.ok(updatedProductWithImage);
    }

    @GetMapping("/admin/products")
    public ResponseEntity<?> getAllProductsForAdmin(
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = Constants.page_size, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = Constants.products_sortBy, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = Constants.sort_order, required = false) String sortOrder) {
        ProductResponse allAdminProducts = IProductService.getAllProductsForAdmin(pageNumber, pageSize, sortBy, sortOrder);
        return ResponseEntity.ok(allAdminProducts);
    }
}
