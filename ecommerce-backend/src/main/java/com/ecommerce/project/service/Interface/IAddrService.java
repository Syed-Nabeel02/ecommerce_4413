package com.ecommerce.project.service.Interface;

import com.ecommerce.project.model.User;
import com.ecommerce.project.DTO.AddressDTO;

import java.util.List;

public interface IAddrService {
    AddressDTO newAddress(AddressDTO addressDTO, User user);

    List<AddressDTO> getAddr();

    AddressDTO getAddrById(Long addressId);

    List<AddressDTO> getUserAddr(User user);

    List<AddressDTO> getAddrByUserId(Long userId);

    AddressDTO updateAddr(Long addressId, AddressDTO addressDTO);

    String delAddr(Long addressId);
}
