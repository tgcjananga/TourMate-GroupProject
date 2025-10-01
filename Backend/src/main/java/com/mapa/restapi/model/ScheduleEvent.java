package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"user","stops","scheduleHotels","scheduleRestaurants"})
public class ScheduleEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    private String startLocation;
    private String endLocation;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String mapUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "scheduleEvent", cascade = CascadeType.ALL)
    private List<Stop> stops;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "scheduleEvent")
    private List<ScheduleHotel> scheduleHotels;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "scheduleEvent")
    private List<ScheduleRestaurant> scheduleRestaurants;

}
