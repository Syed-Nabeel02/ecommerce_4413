// User entity - represents a registered user in the system
package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
        })
public class User {
    // Unique ID for each user
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    // Username (max 20 characters, must be unique)
    @NotBlank
    @Size(max = 20)
    @Column(name = "username")
    private String userName;

    // Email address (must be valid email format and unique)
    @NotBlank
    @Size(max = 50)
    @Email
    @Column(name = "email")
    private String email;

    // Encrypted password (max 120 characters)
    @NotBlank
    @Size(max = 120)
    @Column(name = "password")
    private String password;

    // User's roles (USER, ADMIN, etc.)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // List of user's saved addresses
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    // List of user's saved payment cards
    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<PaymentCard> paymentCards = new ArrayList<>();

    // User's shopping cart
    @OneToOne(mappedBy = "user", cascade = { CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private Cart cart;

    // Products created/owned by this user
    @OneToMany(mappedBy = "user",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
            orphanRemoval = true)
    private Set<Product> products;

    // Default constructor
    public User() {
    }

    // Constructor for creating new user
    public User(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

    // Get user ID
    public Long getUserId() {
        return userId;
    }

    // Set user ID
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Get username
    public String getUserName() {
        return userName;
    }

    // Set username
    public void setUserName(String userName) {
        this.userName = userName;
    }

    // Get email
    public String getEmail() {
        return email;
    }

    // Set email
    public void setEmail(String email) {
        this.email = email;
    }

    // Get password
    public String getPassword() {
        return password;
    }

    // Set password
    public void setPassword(String password) {
        this.password = password;
    }

    // Get user roles
    public Set<Role> getRoles() {
        return roles;
    }

    // Set user roles
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    // Get user addresses
    public List<Address> getAddresses() {
        return addresses;
    }

    // Set user addresses
    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    // Get payment cards
    public List<PaymentCard> getPaymentCards() {
        return paymentCards;
    }

    // Set payment cards
    public void setPaymentCards(List<PaymentCard> paymentCards) {
        this.paymentCards = paymentCards;
    }

    // Get shopping cart
    public Cart getCart() {
        return cart;
    }

    // Set shopping cart
    public void setCart(Cart cart) {
        this.cart = cart;
    }

    // Get user's products
    public Set<Product> getProducts() {
        return products;
    }

    // Set user's products
    public void setProducts(Set<Product> products) {
        this.products = products;
    }
}
