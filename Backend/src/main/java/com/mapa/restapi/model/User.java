package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String firstname;
    private String lastname;
    private String email;
    private String gender;
    private int age;

    @ElementCollection
    private List<String> places;

    private String usertype;
    private String identifier;
    private String password;

}
