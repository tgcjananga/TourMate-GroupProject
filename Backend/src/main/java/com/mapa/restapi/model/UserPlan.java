package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
public class UserPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long planID;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_ID" ,unique = true)
    private User user;

    private LocalDate createDate;
    private LocalDateTime startDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String startLocation;
    private String endLocation;
    private String preference;
}
