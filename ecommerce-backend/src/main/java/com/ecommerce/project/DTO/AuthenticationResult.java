package com.ecommerce.project.DTO;

import com.ecommerce.project.JwtAuth.response.UserInfoResponse;
import org.springframework.http.ResponseCookie;

public class AuthenticationResult {
    private final UserInfoResponse response;
    private final ResponseCookie jwtCookie;

    public AuthenticationResult(UserInfoResponse response, ResponseCookie jwtCookie) {
        this.response = response;
        this.jwtCookie = jwtCookie;
    }

    public UserInfoResponse getResponse() {
        return response;
    }

    public ResponseCookie getJwtCookie() {
        return jwtCookie;
    }
}
