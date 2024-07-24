package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TouristAttraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attractionID;
    private String type;
    private String description;
    private String coordinates;

    @OneToOne(
            cascade = CascadeType.ALL
    )
    @JoinColumn(
            name = "entityID"
    )
    private EntityType entityID;
}
