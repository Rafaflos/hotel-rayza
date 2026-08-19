package com.hotel.backend.dto.auth;

import java.util.List;

public record LoginResponse(
        String token,
        Long userId,
        String username,
        String nombres,
        String apellidos,
        List<String> roles
) {
}
