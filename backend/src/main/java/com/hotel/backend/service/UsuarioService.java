package com.hotel.backend.service;

import com.hotel.backend.dto.usuario.RolResponse;
import com.hotel.backend.dto.usuario.UsuarioRequest;
import com.hotel.backend.dto.usuario.UsuarioResponse;
import com.hotel.backend.entity.Rol;
import com.hotel.backend.entity.Usuario;
import com.hotel.backend.exception.BusinessException;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.RolRepository;
import com.hotel.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository repository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public UsuarioResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public List<RolResponse> findRoles() {
        return rolRepository.findAll().stream()
                .map(r -> new RolResponse(r.getId(), r.getNombre(), r.getDescripcion()))
                .toList();
    }

    @Transactional
    public UsuarioResponse create(UsuarioRequest request) {
        if (repository.existsByUsername(request.username())) {
            throw new BusinessException("Ya existe un usuario con ese nombre de usuario");
        }
        if (request.password() == null || request.password().isBlank()) {
            throw new BusinessException("La contraseña es obligatoria para un usuario nuevo");
        }

        Usuario usuario = Usuario.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .nombres(request.nombres())
                .apellidos(request.apellidos())
                .correo(request.correo())
                .telefono(request.telefono())
                .activo(request.activo() == null || request.activo())
                .roles(resolverRoles(request.rolesIds()))
                .build();

        return toResponse(repository.save(usuario));
    }

    @Transactional
    public UsuarioResponse update(Long id, UsuarioRequest request) {
        Usuario usuario = getEntity(id);

        if (!usuario.getUsername().equals(request.username()) && repository.existsByUsername(request.username())) {
            throw new BusinessException("Ya existe un usuario con ese nombre de usuario");
        }

        usuario.setUsername(request.username());
        usuario.setNombres(request.nombres());
        usuario.setApellidos(request.apellidos());
        usuario.setCorreo(request.correo());
        usuario.setTelefono(request.telefono());
        if (request.activo() != null) {
            usuario.setActivo(request.activo());
        }
        usuario.setRoles(resolverRoles(request.rolesIds()));

        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.password()));
        }

        return toResponse(repository.save(usuario));
    }

    @Transactional
    public void desactivar(Long id) {
        Usuario usuario = getEntity(id);
        if ("admin".equals(usuario.getUsername())) {
            throw new BusinessException("No se puede desactivar el usuario administrador principal");
        }
        usuario.setActivo(false);
        repository.save(usuario);
    }

    private Set<Rol> resolverRoles(Set<Long> rolesIds) {
        Set<Rol> roles = new HashSet<>();
        for (Long rolId : rolesIds) {
            roles.add(rolRepository.findById(rolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + rolId)));
        }
        return roles;
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        List<UsuarioResponse.RolResumen> roles = usuario.getRoles().stream()
                .map(r -> new UsuarioResponse.RolResumen(r.getId(), r.getNombre()))
                .toList();
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getCorreo(),
                usuario.getTelefono(),
                usuario.getActivo(),
                usuario.getUltimoLogin(),
                roles
        );
    }

    private Usuario getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
    }
}
