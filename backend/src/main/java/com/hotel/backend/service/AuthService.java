package com.hotel.backend.service;

import com.hotel.backend.dto.auth.ChangePasswordRequest;
import com.hotel.backend.dto.auth.LoginRequest;
import com.hotel.backend.dto.auth.LoginResponse;
import com.hotel.backend.dto.auth.MeResponse;
import com.hotel.backend.entity.Usuario;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.repository.UsuarioRepository;
import com.hotel.backend.security.JwtService;
import com.hotel.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        UsernamePasswordAuthenticationToken authRequest =
                new UsernamePasswordAuthenticationToken(request.username(), request.password());

        var authentication = authenticationManager.authenticate(authRequest);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Usuario usuario = principal.getUsuario();

        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(principal);

        List<String> roles = usuario.getRoles().stream()
                .map(rol -> rol.getNombre())
                .toList();

        return new LoginResponse(
                token,
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNombres(),
                usuario.getApellidos(),
                roles
        );
    }

    public MeResponse me() {
        Usuario usuario = currentUserService.getUsuario();
        if (usuario == null) {
            throw new BusinessException("No hay una sesión activa");
        }
        List<String> roles = usuario.getRoles().stream().map(Rol -> Rol.getNombre()).toList();
        return new MeResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNombres(),
                usuario.getApellidos(),
                roles
        );
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Usuario usuario = currentUserService.getUsuario();
        if (usuario == null) {
            throw new BusinessException("No hay una sesión activa");
        }
        if (!passwordEncoder.matches(request.currentPassword(), usuario.getPassword())) {
            throw new BusinessException("La contraseña actual es incorrecta");
        }
        usuario.setPassword(passwordEncoder.encode(request.newPassword()));
        usuarioRepository.save(usuario);
    }
}
