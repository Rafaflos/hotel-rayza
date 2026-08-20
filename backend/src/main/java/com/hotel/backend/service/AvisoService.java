package com.hotel.backend.service;

import com.hotel.backend.dto.aviso.AvisoRequest;
import com.hotel.backend.dto.aviso.AvisoResponse;
import com.hotel.backend.entity.*;
import com.hotel.backend.exception.ResourceNotFoundException;
import com.hotel.backend.repository.AvisoLeidoRepository;
import com.hotel.backend.repository.AvisoRepository;
import com.hotel.backend.repository.HabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/** Avisos internos para coordinar al personal entre turnos. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AvisoService {

    private final AvisoRepository repository;
    private final AvisoLeidoRepository leidoRepository;
    private final HabitacionRepository habitacionRepository;
    private final CurrentUserService currentUserService;

    public List<AvisoResponse> findAll(CategoriaAviso categoria, boolean soloPendientes) {
        List<Aviso> avisos;
        if (categoria != null) {
            avisos = repository.findByCategoriaOrderByFechaHoraDesc(categoria);
        } else if (soloPendientes) {
            avisos = repository.findByResueltoFalseOrderByFechaHoraDesc();
        } else {
            avisos = repository.findAllByOrderByFechaHoraDesc();
        }

        Set<Long> leidos = leidosDelUsuarioActual();
        return avisos.stream().map(a -> toResponse(a, leidos)).toList();
    }

    public long contarNoLeidos() {
        Usuario actual = currentUserService.getUsuario();
        if (actual == null) return 0;
        return repository.countNoLeidos(actual.getId());
    }

    @Transactional
    public AvisoResponse create(AvisoRequest request) {
        Habitacion habitacion = request.habitacionId() != null
                ? habitacionRepository.findById(request.habitacionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + request.habitacionId()))
                : null;

        Aviso aviso = Aviso.builder()
                .categoria(request.categoria() != null ? request.categoria() : CategoriaAviso.GENERAL)
                .asunto(request.asunto())
                .mensaje(request.mensaje())
                .prioridad(request.prioridad() != null ? request.prioridad() : PrioridadAviso.NORMAL)
                .habitacion(habitacion)
                .autor(currentUserService.getUsuario())
                .build();

        return toResponse(repository.save(aviso), leidosDelUsuarioActual());
    }

    @Transactional
    public void marcarLeido(Long avisoId) {
        Usuario actual = currentUserService.getUsuario();
        if (actual == null) return;
        if (leidoRepository.existsByAvisoIdAndUsuarioId(avisoId, actual.getId())) return;

        leidoRepository.save(AvisoLeido.builder()
                .avisoId(avisoId)
                .usuarioId(actual.getId())
                .build());
    }

    @Transactional
    public AvisoResponse resolver(Long id) {
        Aviso aviso = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aviso no encontrado: " + id));
        aviso.setResuelto(true);
        return toResponse(repository.save(aviso), leidosDelUsuarioActual());
    }

    private Set<Long> leidosDelUsuarioActual() {
        Usuario actual = currentUserService.getUsuario();
        if (actual == null) return Set.of();
        return leidoRepository.findByUsuarioId(actual.getId()).stream()
                .map(AvisoLeido::getAvisoId)
                .collect(Collectors.toSet());
    }

    private AvisoResponse toResponse(Aviso a, Set<Long> leidos) {
        return new AvisoResponse(
                a.getId(),
                a.getCategoria(),
                a.getAsunto(),
                a.getMensaje(),
                a.getPrioridad(),
                a.getAutor() != null ? a.getAutor().getNombres() + " " + a.getAutor().getApellidos() : null,
                a.getHabitacion() != null ? a.getHabitacion().getNumero() : null,
                a.getResuelto(),
                leidos.contains(a.getId()),
                a.getFechaHora()
        );
    }
}
