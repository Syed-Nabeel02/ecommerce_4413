// Product entity - represents a product in our ecommerce store
package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    // Unique ID for each product
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    // Product name (min 3 characters)
    @NotBlank
    @Size(min = 3, message = "Product name must contain atleast 3 characters")
    private String productName;

    // Product image filename
    private String image;

    // Product description (min 6 characters)
    @NotBlank
    @Size(min = 6, message = "Product description must contain atleast 6 characters")
    private String description;

    // Available stock quantity
    private Integer quantity;

    // Product price
    private double price;

    // Category this product belongs to
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // User who created/owns this product
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // List of cart items containing this product
    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private List<CartItem> products = new ArrayList<>();

    // Default constructor
    public Product() {
    }

    // Constructor with all fields
    public Product(Long productId, String productName, String image, String description, Integer quantity, double price, Category category, User user, List<CartItem> products) {
        this.productId = productId;
        this.productName = productName;
        this.image = image;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
        this.user = user;
        this.products = products;
    }

    // Get product ID
    public Long getProductId() {
        return productId;
    }

    // Set product ID
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    // Get product name
    public String getProductName() {
        return productName;
    }

    // Set product name
    public void setProductName(String productName) {
        this.productName = productName;
    }

    // Get image filename
    public String getImage() {
        return image;
    }

    // Set image filename
    public void setImage(String image) {
        this.image = image;
    }

    // Get description
    public String getDescription() {
        return description;
    }

    // Set description
    public void setDescription(String description) {
        this.description = description;
    }

    // Get available quantity
    public Integer getQuantity() {
        return quantity;
    }

    // Set available quantity
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    // Get price
    public double getPrice() {
        return price;
    }

    // Set price
    public void setPrice(double price) {
        this.price = price;
    }

    // Get category
    public Category getCategory() {
        return category;
    }

    // Set category
    public void setCategory(Category category) {
        this.category = category;
    }

    // Get user who owns this product
    public User getUser() {
        return user;
    }

    // Set user who owns this product
    public void setUser(User user) {
        this.user = user;
    }

    // Get list of cart items
    public List<CartItem> getProducts() {
        return products;
    }

    // Set list of cart items
    public void setProducts(List<CartItem> products) {
        this.products = products;
    }
}
