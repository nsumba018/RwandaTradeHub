package com.rwandatradehub.service;

import com.rwandatradehub.dto.AuthResponse;
import com.rwandatradehub.dto.LoginRequest;
import com.rwandatradehub.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
