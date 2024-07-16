package com.mapa.restapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int historyID;

    private Date date;

    @ManyToOne()
    @JoinColumn(
            name = "user_id"
    )
    private User user;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "history_place_map",
            joinColumns =@JoinColumn(
                    name = "history_id",
                    referencedColumnName = "historyID"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "attraction_id",
                    referencedColumnName = "attractionID"
            )
    )
    private List<TouristAttraction> attractions;

    public void addAttraction(TouristAttraction attraction) {
        if(attractions == null) {
            attractions = new ArrayList<>();
        }
        attractions.add(attraction);
    }
}
