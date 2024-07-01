package com.mapa.restapi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.*;

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
    private Long id;
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
    
}
