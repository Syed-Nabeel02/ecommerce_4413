package com.ecommerce.project.JwtAuth.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
    private static final String UNAUTHORIZED_ERROR = "Unauthorized error: {}";
    private static final int UNAUTHORIZED_STATUS = HttpServletResponse.SC_UNAUTHORIZED;
    private static final String ERROR_LABEL = "error";
    private static final String MESSAGE_LABEL = "message";
    private static final String STATUS_LABEL = "status";
    private static final String PATH_LABEL = "path";

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        logUnauthorizedAttempt(authException);
        configureResponseHeaders(response);

        Map<String, Object> errorResponseBody = buildErrorResponse(request, authException);
        writeErrorResponseToStream(response, errorResponseBody);
    }

    private void logUnauthorizedAttempt(AuthenticationException authException) {
        logger.error(UNAUTHORIZED_ERROR, authException.getMessage());
    }

    private void configureResponseHeaders(HttpServletResponse response) {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(UNAUTHORIZED_STATUS);
    }

    private Map<String, Object> buildErrorResponse(HttpServletRequest request, AuthenticationException authException) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put(STATUS_LABEL, UNAUTHORIZED_STATUS);
        errorBody.put(ERROR_LABEL, "Unauthorized");
        errorBody.put(MESSAGE_LABEL, authException.getMessage());
        errorBody.put(PATH_LABEL, request.getServletPath());
        return errorBody;
    }

    private void writeErrorResponseToStream(HttpServletResponse response, Map<String, Object> errorResponseBody)
            throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getOutputStream(), errorResponseBody);
    }
}
