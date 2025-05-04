package com.eventmanagement.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Test
    void login_ShouldReturnAuthenticationDetails() {
        // Setup mock authentication
        Authentication auth = new TestingAuthenticationToken(
                "testuser", 
                null, 
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> response = authController.login();

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof Map);
        
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("testuser", body.get("username"));
        assertEquals(true, body.get("authenticated"));
    }
}