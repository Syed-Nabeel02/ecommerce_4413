package com.ecommerce.project.controller;

import com.ecommerce.project.model.User;
import com.ecommerce.project.DTO.AddressDTO;
import com.ecommerce.project.service.Interface.IAddrService;
import com.ecommerce.project.helper.AuthHelper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AddrController {

    private final AuthHelper authHelper;
    private final IAddrService IAddrService;

    public AddrController(AuthHelper authHelper, IAddrService IAddrService) {
        this.authHelper = authHelper;
        this.IAddrService = IAddrService;
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> newAddress(@Valid @RequestBody AddressDTO addressDTO) {
        User user = authHelper.loggedInUser();
        AddressDTO savedAddressDTO = IAddrService.newAddress(addressDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAddressDTO);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAddr() {
        List<AddressDTO> addressList = IAddrService.getAddr();
        return ResponseEntity.ok(addressList);
    }

    @GetMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAddrById(@PathVariable Long addressId) {
        AddressDTO addressDTO = IAddrService.getAddrById(addressId);
        return ResponseEntity.ok(addressDTO);
    }

    @GetMapping("/users/addresses")
    public ResponseEntity<List<AddressDTO>> getUserAddr() {
        User user = authHelper.loggedInUser();
        List<AddressDTO> addressList = IAddrService.getUserAddr(user);
        return ResponseEntity.ok(addressList);
    }

    @GetMapping("/admin/addresses/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AddressDTO>> getAddrByUserId(@PathVariable Long userId) {
        List<AddressDTO> addressList = IAddrService.getAddrByUserId(userId);
        return ResponseEntity.ok(addressList);
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Long addressId,
                                                    @RequestBody AddressDTO addressDTO) {
        AddressDTO updatedAddress = IAddrService.updateAddr(addressId, addressDTO);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long addressId) {
        String status = IAddrService.delAddr(addressId);
        return ResponseEntity.ok(status);
    }
}