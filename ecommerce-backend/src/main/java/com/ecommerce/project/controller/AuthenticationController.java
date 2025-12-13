package com.ecommerce.project.controller;

import com.ecommerce.project.config.Constants;
import com.ecommerce.project.DTO.AuthenticationResult;
import com.ecommerce.project.JwtAuth.request.LoginRequest;
import com.ecommerce.project.JwtAuth.request.SignupRequest;
import com.ecommerce.project.JwtAuth.request.UpdateUsernameRequest;
import com.ecommerce.project.JwtAuth.response.MessageResponse;
import com.ecommerce.project.service.Interface.IAuthenticationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final IAuthenticationService IAuthenticationService;

    public AuthenticationController(IAuthenticationService IAuthenticationService) {
        this.IAuthenticationService = IAuthenticationService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid login request"));
        }

        AuthenticationResult result = IAuthenticationService.login(loginRequest);
        if (result == null || result.getJwtCookie() == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Authentication failed"));
        }

        String cookie = result.getJwtCookie().toString();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie)
                .body(result.getResponse());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return IAuthenticationService.register(signUpRequest);
    }

    @GetMapping("/username")
    public String currentUserName(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return "";
        }
        return authentication.getName();
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {
        return ResponseEntity.ok().body(IAuthenticationService.getCurrentUserDetails(authentication));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signoutUser() {
        ResponseCookie cookie = IAuthenticationService.logoutUser();
        if (cookie == null) {
            return ResponseEntity.ok().body(new MessageResponse("No active session"));
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

    @GetMapping("/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(name = "pageNumber", defaultValue = Constants.page_num, required = false) Integer pageNumber) {

        int safePageNumber = (pageNumber == null || pageNumber < 0) ? 0 : pageNumber;

        int pageSize;
        try {
            pageSize = Integer.parseInt(Constants.page_size);
            if (pageSize <= 0) pageSize = 10;
        } catch (NumberFormatException ex) {
            pageSize = 10;
        }

        Sort sortByAndOrder = Sort.by(Constants.users_sort_by).descending();
        Pageable pageDetails = PageRequest.of(safePageNumber, pageSize, sortByAndOrder);

        return ResponseEntity.ok(IAuthenticationService.getAllCustomers(pageDetails));
    }

    @PutMapping("/user/username")
    public ResponseEntity<?> updateUsername(
            @Valid @RequestBody UpdateUsernameRequest request,
            Authentication authentication) {
        return IAuthenticationService.updateUsername(request, authentication);
    }

}