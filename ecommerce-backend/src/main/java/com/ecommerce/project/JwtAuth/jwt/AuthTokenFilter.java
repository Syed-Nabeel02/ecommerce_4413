package com.ecommerce.project.JwtAuth.jwt;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.project.JwtAuth.services.UserDetailsServiceImpl;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);
    private static final String DEBUG_FILTER_CALLED = "AuthTokenFilter called for URI: {}";
    private static final String DEBUG_ROLES_FROM_JWT = "Roles from JWT: {}";
    private static final String ERROR_SET_AUTHENTICATION = "Cannot set user authentication: {}";

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthTokenFilter(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logFilterInvocation(request);

        try {
            processJwtAuthentication(request);
        } catch (Exception exception) {
            logAuthenticationError(exception);
        }

        filterChain.doFilter(request, response);
    }

    private void logFilterInvocation(HttpServletRequest request) {
        logger.debug(DEBUG_FILTER_CALLED, request.getRequestURI());
    }

    private void processJwtAuthentication(HttpServletRequest request) {
        String jwtToken = parseJwtToken(request);

        if (isValidToken(jwtToken)) {
            authenticateUser(jwtToken, request);
        }
    }

    private String parseJwtToken(HttpServletRequest request) {
        String jwtFromCookie = jwtUtils.getJwtFromCookies(request);
        if (jwtFromCookie != null) {
            return jwtFromCookie;
        }

        return jwtUtils.getJwtFromHeader(request);
    }

    private boolean isValidToken(String jwtToken) {
        return jwtToken != null && jwtUtils.validateJwtToken(jwtToken);
    }

    private void authenticateUser(String jwtToken, HttpServletRequest request) {
        String username = extractUsernameFromToken(jwtToken);
        UserDetails userDetails = loadUserDetails(username);

        UsernamePasswordAuthenticationToken authentication = buildAuthenticationToken(userDetails, request);
        logUserRoles(userDetails);

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private String extractUsernameFromToken(String jwtToken) {
        return jwtUtils.getUserNameFromJwtToken(jwtToken);
    }

    private UserDetails loadUserDetails(String username) {
        return userDetailsService.loadUserByUsername(username);
    }

    private UsernamePasswordAuthenticationToken buildAuthenticationToken(UserDetails userDetails, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        return authentication;
    }

    private void logUserRoles(UserDetails userDetails) {
        logger.debug(DEBUG_ROLES_FROM_JWT, userDetails.getAuthorities());
    }

    private void logAuthenticationError(Exception exception) {
        logger.error(ERROR_SET_AUTHENTICATION, exception);
    }
}
