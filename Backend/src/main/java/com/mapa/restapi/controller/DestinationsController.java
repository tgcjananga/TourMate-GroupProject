package com.mapa.restapi.controller;

import com.mapa.restapi.model.Destination;
import com.mapa.restapi.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin // Allows requests from other origins (like your HTML/JS frontend)
public class DestinationsController {

    @Autowired
    private DestinationService destinationService;
    // Endpoint to fetch all destinations (optional, useful for debugging)
    @GetMapping
    public List<Destination> getAllDestinations() {
        return destinationService.getAllDestinations();
    }

    // Endpoint to get destination suggestions based on user input
    @GetMapping("/suggestions")
    public List<Destination> getSuggestions(@RequestParam("query") String query) {
        return destinationService.getSuggestions(query);
    }

    // Endpoint to get destination coordinates by name
    @GetMapping("/coordinates")
    public Destination getDestinationCoordinates(@RequestParam("name") String name) {
        return destinationService.getDestinationByName(name);
    }
}
