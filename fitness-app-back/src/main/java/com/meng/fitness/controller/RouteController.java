package com.meng.fitness.controller;

import com.meng.fitness.dto.CheckInRequest;
import com.meng.fitness.dto.CheckInResponse;
import com.meng.fitness.dto.CheckpointResponse;
import com.meng.fitness.dto.RouteResponse;
import com.meng.fitness.entity.CheckIn;
import com.meng.fitness.entity.Checkpoint;
import com.meng.fitness.entity.Route;
import com.meng.fitness.entity.User;
import com.meng.fitness.repository.CheckInRepository;
import com.meng.fitness.repository.CheckpointRepository;
import com.meng.fitness.repository.RouteRepository;
import com.meng.fitness.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/routes")
public class RouteController {

    private final RouteRepository routeRepository;
    private final CheckpointRepository checkpointRepository;
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;

    public RouteController(RouteRepository routeRepository,
                           CheckpointRepository checkpointRepository,
                           CheckInRepository checkInRepository,
                           UserRepository userRepository) {
        this.routeRepository = routeRepository;
        this.checkpointRepository = checkpointRepository;
        this.checkInRepository = checkInRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<RouteResponse> getRoutes() {
        return routeRepository.findAll()
                .stream()
                .map(this::toRouteResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{routeId}")
    public ResponseEntity<RouteResponse> getRoute(@PathVariable Long routeId) {
        return routeRepository.findById(routeId)
                .map(route -> ResponseEntity.ok(toRouteResponse(route)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{routeId}/checkins")
    public ResponseEntity<List<CheckInResponse>> getCheckIns(@PathVariable Long routeId,
                                                             @RequestParam String username) {
        List<CheckInResponse> responses = checkInRepository
                .findByUserUsernameAndRouteIdOrderByCheckedAtAsc(username, routeId)
                .stream()
                .map(this::toCheckInResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{routeId}/checkins")
    public ResponseEntity<?> createCheckIn(@PathVariable Long routeId,
                                           @RequestBody CheckInRequest request) {
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (request.getCheckpointId() == null) {
            return ResponseEntity.badRequest().body("Checkpoint id is required");
        }

        Route route = routeRepository.findById(routeId).orElse(null);
        if (route == null) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body("Unknown user");
        }

        Optional<Checkpoint> checkpointOpt = checkpointRepository.findById(request.getCheckpointId());
        if (!checkpointOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Checkpoint does not exist");
        }
        Checkpoint checkpoint = checkpointOpt.get();
        if (!checkpoint.getRoute().getId().equals(routeId)) {
            return ResponseEntity.badRequest().body("Checkpoint does not belong to the route");
        }

        CheckIn checkIn = new CheckIn();
        checkIn.setRoute(route);
        checkIn.setUser(user);
        checkIn.setCheckpoint(checkpoint);
        checkIn.setCheckedAt(LocalDateTime.now());

        CheckIn saved = checkInRepository.save(checkIn);
        return ResponseEntity.ok(toCheckInResponse(saved));
    }

    private RouteResponse toRouteResponse(Route route) {
        List<CheckpointResponse> checkpointResponses = route.getCheckpoints()
                .stream()
                .sorted((a, b) -> Integer.compare(a.getSequenceOrder(), b.getSequenceOrder()))
                .map(cp -> new CheckpointResponse(cp.getId(), cp.getLatitude(), cp.getLongitude(), cp.getSequenceOrder()))
                .collect(Collectors.toList());

        return new RouteResponse(
                route.getId(),
                route.getName(),
                route.getDescription(),
                route.getDistanceKm(),
                checkpointResponses
        );
    }

    private CheckInResponse toCheckInResponse(CheckIn checkIn) {
        Long checkpointId = checkIn.getCheckpoint() != null ? checkIn.getCheckpoint().getId() : null;
        return new CheckInResponse(
                checkIn.getId(),
                checkIn.getRoute().getId(),
                checkpointId,
                checkIn.getUser().getUsername(),
                checkIn.getCheckedAt()
        );
    }
}
