package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntityType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int entityID;

    @Enumerated(EnumType.STRING)
    private PlaceType entityType;

    @OneToOne(
            mappedBy = "entityID"
    )
    private Restaurant restaurant;

    @OneToOne(
            mappedBy = "entityID"
    )
    private Hotel hotel;

    @OneToOne(
            mappedBy = "entityID"
    )
    private TouristAttraction touristAttraction;

    @OneToOne(
            mappedBy = "entityID"
    )
    private BookmarkedPlace bookmarked;

}
