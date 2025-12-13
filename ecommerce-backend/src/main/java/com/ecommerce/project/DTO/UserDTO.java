package com.ecommerce.project.DTO;

import java.util.HashSet;
import java.util.Set;

import com.ecommerce.project.model.Role;

public class UserDTO {

	private Long userId;
	private String username;
	private String email;
	private String password;
	private Set<Role> roles = new HashSet<>();
	private AddressDTO address;
	private CartDTO cart;

	public UserDTO() {
	}

	public UserDTO(Long userId, String username, String email, String password, Set<Role> roles, AddressDTO address, CartDTO cart) {
		this.userId = userId;
		this.username = username;
		this.email = email;
		this.password = password;
		this.roles = roles;
		this.address = address;
		this.cart = cart;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public AddressDTO getAddress() {
		return address;
	}

	public void setAddress(AddressDTO address) {
		this.address = address;
	}

	public CartDTO getCart() {
		return cart;
	}

	public void setCart(CartDTO cart) {
		this.cart = cart;
	}
}
