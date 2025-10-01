package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "destinations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "destination_name",unique = true)
    private String destinationName;

    @Column(name = "description", length = 1000)
    private String description;

    private String district;

    private double latitude;

    private double longitude;


}
