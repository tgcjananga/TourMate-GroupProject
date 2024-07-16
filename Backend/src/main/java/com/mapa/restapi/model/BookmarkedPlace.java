package com.mapa.restapi.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkedPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookmarkID;

    private Date date;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "entity_id")
    private EntityType entityID;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;
}
