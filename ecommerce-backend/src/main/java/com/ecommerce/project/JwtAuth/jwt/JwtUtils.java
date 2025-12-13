package com.ecommerce.project.JwtAuth.jwt;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.ecommerce.project.JwtAuth.services.UserDetailsImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final int BEARER_PREFIX_LENGTH = 7;
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final int JWT_COOKIE_MAX_AGE = 24 * 60 * 60;
    private static final String API_PATH = "/api";
    private static final String ERROR_INVALID_JWT = "Invalid JWT token: {}";
    private static final String ERROR_EXPIRED_JWT = "JWT token is expired: {}";
    private static final String ERROR_UNSUPPORTED_JWT = "JWT token is unsupported: {}";
    private static final String ERROR_EMPTY_JWT = "JWT claims string is empty: {}";

    @Value("${spring.app.jwtSecret}")
    private String jwtSecret;

    @Value("${spring.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${spring.ecom.app.jwtCookieName}")
    private String jwtCookieName;

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie jwtCookie = WebUtils.getCookie(request, jwtCookieName);
        return extractCookieValue(jwtCookie);
    }

    public String getJwtFromHeader(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
        return extractJwtFromBearerToken(authorizationHeader);
    }

    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
        String jwtToken = generateTokenFromUsername(userPrincipal.getUsername());
        return buildJwtCookie(jwtToken);
    }

    public ResponseCookie getCleanJwtCookie() {
        return buildCleanCookie();
    }

    public String generateTokenFromUsername(String username) {
        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(currentDate)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException exception) {
            logTokenValidationError(ERROR_INVALID_JWT, exception);
        } catch (ExpiredJwtException exception) {
            logTokenValidationError(ERROR_EXPIRED_JWT, exception);
        } catch (UnsupportedJwtException exception) {
            logTokenValidationError(ERROR_UNSUPPORTED_JWT, exception);
        } catch (IllegalArgumentException exception) {
            logTokenValidationError(ERROR_EMPTY_JWT, exception);
        }
        return false;
    }

    private String extractCookieValue(Cookie jwtCookie) {
        return jwtCookie != null ? jwtCookie.getValue() : null;
    }

    private String extractJwtFromBearerToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX)) {
            return authorizationHeader.substring(BEARER_PREFIX_LENGTH);
        }
        return null;
    }

    private ResponseCookie buildJwtCookie(String jwtToken) {
        return ResponseCookie.from(jwtCookieName, jwtToken)
                .path(API_PATH)
                .maxAge(JWT_COOKIE_MAX_AGE)
                .httpOnly(false)
                .secure(false)
                .build();
    }

    private ResponseCookie buildCleanCookie() {
        return ResponseCookie.from(jwtCookieName, null)
                .path(API_PATH)
                .build();
    }

    private Key getSigningKey() {
        byte[] decodedKey = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    private void logTokenValidationError(String errorMessage, Exception exception) {
        logger.error(errorMessage, exception.getMessage());
    }
}