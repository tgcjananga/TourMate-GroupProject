package com.mapa.restapi.service;

import com.mapa.restapi.model.Destination;
import com.mapa.restapi.repo.DestinationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepo destinationRepository;

    // Fetch all destinations from the database
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    // Fetch destination suggestions based on user input
    public List<Destination> getSuggestions(String query) {
        return destinationRepository.findByDestinationNameContaining(query);
    }

    // Fetch destination coordinates by name
    public Destination getDestinationByName(String destinationName) {
        List<Destination> destinations = destinationRepository.findByDestinationNameContaining(destinationName);
        if (!destinations.isEmpty()) {
            return destinations.get(0); // Return the first matching result
        }
        return null;
    }
}

