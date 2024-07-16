package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long hotelID;

    private String name;
    private String coordinates;
    private String address;

    @OneToOne(
            cascade = CascadeType.ALL
    )
    @JoinColumn(
            name = "entityID"
    )
    private EntityType entityID;

}
