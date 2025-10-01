package com.mapa.restapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"scheduleEvent"})
public class Stop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stopId;

    private String fromLocation;
    private String toLocation;
    private double distance;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private long waitingTime; // in minutes

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_event_id")
    @JsonIgnore
    private ScheduleEvent scheduleEvent;

}
