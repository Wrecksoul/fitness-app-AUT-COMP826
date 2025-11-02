package com.meng.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RouteResponse {
    private Long id;
    private String name;
    private String description;
    private double distanceKm;
    private List<CheckpointResponse> checkpoints;
}
