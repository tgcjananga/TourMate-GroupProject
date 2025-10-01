package com.mapa.restapi.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TouristAttractionDTO {

    private long id;
    private String type;
    private String description;
    private String name;
    private String city;
    private String imgUrl;
    private double latitude;
    private double longitude;
    private String rating;
    private String web_url;
    private String phone;
    private String address;
    private Long apiLocationId;


}


