package com.mapa.restapi.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int planID;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_ID")
    private User user;

    private Date startDate;
    private Date endDate;
    private String startLocation;
    private String endLocation;

    @OneToMany(cascade = CascadeType.ALL , mappedBy = "planID")
    private List<PlanItems> planItems;

    private String routeInfo;  // New field for route information
    private long totalTime;    // New field for total time needed
}
