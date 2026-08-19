package com.hotel.backend.service;

import com.hotel.backend.entity.Usuario;
import com.hotel.backend.repository.UsuarioRepository;
import com.hotel.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UsuarioRepository usuarioRepository;

    public Usuario getUsuario() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }
        return usuarioRepository.findById(principal.getUsuario().getId()).orElse(null);
    }
}
