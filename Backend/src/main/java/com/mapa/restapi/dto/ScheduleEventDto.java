package com.mapa.restapi.dto;

import com.mapa.restapi.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
// Class to represent a scheduled event
public class ScheduleEventDto {
    private Long scheduleId;
    private String startLocation;
    private String endLocation;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<Stop> stops;
    private List<ScheduleHotel> hotels;
    private List<ScheduleRestaurant> restaurants;
    private String mapUrl;
}

