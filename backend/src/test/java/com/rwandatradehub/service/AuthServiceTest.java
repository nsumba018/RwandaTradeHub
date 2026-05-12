package com.rwandatradehub.service;

import com.rwandatradehub.dto.AuthResponse;
import com.rwandatradehub.dto.RegisterRequest;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.enums.Role;
import com.rwandatradehub.exception.UserAlreadyExistsException;
import com.rwandatradehub.repository.UserRepository;
import com.rwandatradehub.security.JwtService;
import com.rwandatradehub.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFullName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole(Role.SME);

        savedUser = User.builder()
                .id(1L).fullName("Test User")
                .email("test@example.com")
                .password("encoded").role(Role.SME).build();
    }

    @Test
    void register_shouldSucceed_whenEmailIsNew() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDetails ud = new org.springframework.security.core.userdetails.User(
                "test@example.com", "encoded", List.of());
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(ud);
        when(jwtService.generateToken(ud)).thenReturn("mock-token");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.getToken()).isEqualTo("mock-token");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getRole()).isEqualTo(Role.SME);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_shouldThrow_whenEmailAlreadyExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("test@example.com");
    }

    @Test
    void login_shouldSucceed_withValidCredentials() {
        var loginRequest = new com.rwandatradehub.dto.LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(savedUser));
        UserDetails ud = new org.springframework.security.core.userdetails.User(
                "test@example.com", "encoded", List.of());
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(ud);
        when(jwtService.generateToken(ud)).thenReturn("mock-token");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.getToken()).isEqualTo("mock-token");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
    }
}
