package com.mapa.restapi.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.*;

import java.util.List;

/*
User Entity
PK : id (Auto Increment)
 */

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(unique=true)
    private String email;

    private String password;
    private String gender;
    private int age;
    private String usertype;
    private String identifier;

    @OneToOne(mappedBy = "user")
    private ForgotPassword forgotPassword;

    @OneToMany(
            mappedBy = "user",
            orphanRemoval = true,
            cascade = CascadeType.ALL
    )
    private List<UserHistory> userHistories;

    @OneToOne(
            mappedBy = "user",
            orphanRemoval = true,
            cascade = CascadeType.ALL
    )
    private UserPlan userPlan;


    @OneToMany(
            mappedBy = "user",
            orphanRemoval = true,
            cascade = CascadeType.ALL
    )
    private List<BookmarkedPlace> bookmarkedPlaces;
    
}
