package com.meng.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CheckInResponse {
    private Long id;
    private Long routeId;
    private Long checkpointId;
    private String username;
    private LocalDateTime checkedAt;
}
