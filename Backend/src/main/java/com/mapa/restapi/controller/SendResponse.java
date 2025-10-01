package com.mapa.restapi.controller;
import com.mapa.restapi.dto.UserDto;

public class SendResponse {
    private String token;
    private UserDto user;

    // Constructor
    public SendResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}