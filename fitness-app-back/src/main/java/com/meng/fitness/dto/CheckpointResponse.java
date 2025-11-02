package com.meng.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckpointResponse {
    private Long id;
    private double latitude;
    private double longitude;
    private int order;
}
