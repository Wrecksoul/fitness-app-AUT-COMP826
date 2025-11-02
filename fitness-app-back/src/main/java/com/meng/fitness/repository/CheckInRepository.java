package com.meng.fitness.repository;

import com.meng.fitness.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByUserUsernameAndRouteIdOrderByCheckedAtAsc(String username, Long routeId);
}
