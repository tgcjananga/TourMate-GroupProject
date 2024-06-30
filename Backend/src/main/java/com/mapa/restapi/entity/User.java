package com.mapa.restapi.entity;


import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstname;
    private String lastname;
    @Column(unique=true)
    private String email;
    private String password;
    private String gender;
    private int age;
    private String usertype;
    private String identifier;
    @ElementCollection
    private List<String> places;
    @OneToOne(mappedBy = "user")
    private ForgotPassword forgotPassword;
    
}
