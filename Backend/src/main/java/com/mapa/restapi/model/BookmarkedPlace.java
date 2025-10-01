package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user","attraction_id"})
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "attraction_id"})})
public class BookmarkedPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long bookmarkID;

    private LocalDate date;

    @ManyToOne (fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinColumn(name = "attraction_id")
    private TouristAttraction attraction_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
