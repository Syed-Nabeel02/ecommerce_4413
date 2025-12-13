package com.ecommerce.project.service.Interface;

import com.ecommerce.project.DTO.AuthenticationResult;
import com.ecommerce.project.DTO.UserResponse;
import com.ecommerce.project.JwtAuth.request.LoginRequest;
import com.ecommerce.project.JwtAuth.request.SignupRequest;
import com.ecommerce.project.JwtAuth.request.UpdateUsernameRequest;
import com.ecommerce.project.JwtAuth.response.MessageResponse;
import com.ecommerce.project.JwtAuth.response.UserInfoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public interface IAuthenticationService {

    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<MessageResponse> register(SignupRequest signUpRequest);

    UserInfoResponse getCurrentUserDetails(Authentication authentication);

    ResponseCookie logoutUser();

    UserResponse getAllCustomers(Pageable pageable);

    ResponseEntity<MessageResponse> updateUsername(UpdateUsernameRequest request, Authentication authentication);
}
