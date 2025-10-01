package com.mapa.restapi.dto;

import lombok.Data;

import java.util.List;

@Data
public class SuggestPlaceRequest {
    private List<String> cities;
    private List<String> preference;
}
