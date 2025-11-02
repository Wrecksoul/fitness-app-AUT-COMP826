package com.meng.fitness.repository;

import com.meng.fitness.entity.Checkpoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckpointRepository extends JpaRepository<Checkpoint, Long> {
    List<Checkpoint> findByRouteIdOrderBySequenceOrderAsc(Long routeId);
}
