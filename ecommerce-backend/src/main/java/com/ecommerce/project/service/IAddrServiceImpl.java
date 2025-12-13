package com.ecommerce.project.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.ecommerce.project.DAO.AddressDAO;
import com.ecommerce.project.DAO.UserDAO;
import com.ecommerce.project.DTO.AddressDTO;
import com.ecommerce.project.errorHandler.ResourceNotFoundException;
import com.ecommerce.project.model.Address;
import com.ecommerce.project.model.User;
import com.ecommerce.project.service.Interface.IAddrService;

@Service
public class IAddrServiceImpl implements IAddrService {

    private final AddressDAO addressDAO;
    private final UserDAO userDAO;
    private final ModelMapper modelMapper;

    public IAddrServiceImpl(AddressDAO addressDAO, UserDAO userDAO, ModelMapper modelMapper) {
        this.addressDAO = addressDAO;
        this.userDAO = userDAO;
        this.modelMapper = modelMapper;
    }

    @Override
    public AddressDTO newAddress(AddressDTO addressDTO, User user) {
        Address addressEntity = convertDTOToEntity(addressDTO);
        associateAddressWithUser(addressEntity, user);

        Address persistedAddress = addressDAO.save(addressEntity);
        return convertEntityToDTO(persistedAddress);
    }

    @Override
    public List<AddressDTO> getAddr() {
        List<Address> allAddresses = addressDAO.findAll();
        return transformAddressesToDTOs(allAddresses);
    }

    @Override
    public AddressDTO getAddrById(Long addressId) {
        Address retrievedAddress = fetchAddressOrThrowException(addressId);
        return convertEntityToDTO(retrievedAddress);
    }

    @Override
    public List<AddressDTO> getUserAddr(User user) {
        List<Address> userAddressList = user.getAddresses();
        return transformAddressesToDTOs(userAddressList);
    }

    @Override
    public List<AddressDTO> getAddrByUserId(Long userId) {
        User retrievedUser = fetchUserOrThrowException(userId);
        List<Address> userAddressList = retrievedUser.getAddresses();
        return transformAddressesToDTOs(userAddressList);
    }

    @Override
    public AddressDTO updateAddr(Long addressId, AddressDTO addressDTO) {
        Address existingAddress = fetchAddressOrThrowException(addressId);
        applyAddressUpdates(existingAddress, addressDTO);

        Address modifiedAddress = addressDAO.save(existingAddress);
        synchronizeUserAddressList(existingAddress.getUser(), addressId, modifiedAddress);

        return convertEntityToDTO(modifiedAddress);
    }

    @Override
    public String delAddr(Long addressId) {
        Address addressToDelete = fetchAddressOrThrowException(addressId);
        User associatedUser = addressToDelete.getUser();

        removeAddressFromUser(associatedUser, addressId);
        addressDAO.delete(addressToDelete);

        return buildDeletionMessage(addressId);
    }

    private Address convertDTOToEntity(AddressDTO addressDTO) {
        return modelMapper.map(addressDTO, Address.class);
    }

    private AddressDTO convertEntityToDTO(Address address) {
        return modelMapper.map(address, AddressDTO.class);
    }

    private List<AddressDTO> transformAddressesToDTOs(List<Address> addresses) {
        return addresses.stream()
                .map(this::convertEntityToDTO)
                .toList();
    }

    private void associateAddressWithUser(Address addressEntity, User user) {
        addressEntity.setUser(user);
        List<Address> userAddressCollection = user.getAddresses();
        userAddressCollection.add(addressEntity);
        user.setAddresses(userAddressCollection);
    }

    private Address fetchAddressOrThrowException(Long addressId) {
        return addressDAO.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
    }

    private User fetchUserOrThrowException(Long userId) {
        return userDAO.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    private void applyAddressUpdates(Address targetAddress, AddressDTO sourceDTO) {
        targetAddress.setCity(sourceDTO.getCity());
        targetAddress.setPincode(sourceDTO.getPincode());
        targetAddress.setState(sourceDTO.getState());
        targetAddress.setCountry(sourceDTO.getCountry());
        targetAddress.setStreet(sourceDTO.getStreet());
        targetAddress.setBuildingName(sourceDTO.getBuildingName());
    }

    private void synchronizeUserAddressList(User user, Long addressIdToReplace, Address newAddress) {
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressIdToReplace));
        user.getAddresses().add(newAddress);
        userDAO.save(user);
    }

    private void removeAddressFromUser(User user, Long addressId) {
        user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        userDAO.save(user);
    }

    private String buildDeletionMessage(Long addressId) {
        return "Address deleted successfully with addressId: " + addressId;
    }
}
