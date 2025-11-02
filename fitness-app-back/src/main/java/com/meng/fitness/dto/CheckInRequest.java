package com.meng.fitness.dto;

import lombok.Data;

@Data
public class CheckInRequest {
    private String username;
    private Long checkpointId;
}
