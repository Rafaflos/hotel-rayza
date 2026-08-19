package com.hotel.backend.dto.auth;

import java.util.List;

public record MeResponse(
        Long id,
        String username,
        String nombres,
        String apellidos,
        List<String> roles
) {
}
