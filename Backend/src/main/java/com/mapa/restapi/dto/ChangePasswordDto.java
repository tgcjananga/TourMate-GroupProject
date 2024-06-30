package com.mapa.restapi.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDto {

    private String password;
    private String repeatPassword;

    
}
