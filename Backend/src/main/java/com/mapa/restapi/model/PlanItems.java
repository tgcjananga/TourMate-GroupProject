package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int planItemID;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private UserPlan planID;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bookmark_id")
    private BookmarkedPlace bookmarkID;

}
