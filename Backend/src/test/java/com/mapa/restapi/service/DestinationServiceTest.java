package com.mapa.restapi.service;

import com.mapa.restapi.model.Destination;
import com.mapa.restapi.repo.DestinationRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DestinationServiceTest {

    @InjectMocks
    private DestinationService destinationService;

    @Mock
    private DestinationRepo destinationRepo;

    private Destination destination;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        destination = new Destination();
        destination.setDestinationName("Paris");
        destination.setLatitude(48.8566);
        destination.setLongitude(2.3522);
    }

    @Test
    void testGetAllDestinations() {
        List<Destination> destinations = new ArrayList<>();
        destinations.add(destination);

        when(destinationRepo.findAll()).thenReturn(destinations);

        List<Destination> result = destinationService.getAllDestinations();

        assertEquals(1, result.size());
        assertEquals("Paris", result.get(0).getDestinationName());
        verify(destinationRepo, times(1)).findAll();
    }

    @Test
    void testGetSuggestions() {
        List<Destination> destinations = new ArrayList<>();
        destinations.add(destination);

        when(destinationRepo.findByDestinationNameContaining("Par")).thenReturn(destinations);

        List<Destination> result = destinationService.getSuggestions("Par");

        assertEquals(1, result.size());
        assertEquals("Paris", result.get(0).getDestinationName());
        verify(destinationRepo, times(1)).findByDestinationNameContaining("Par");
    }

    @Test
    void testGetDestinationByName_Found() {
        List<Destination> destinations = new ArrayList<>();
        destinations.add(destination);

        when(destinationRepo.findByDestinationNameContaining("Paris")).thenReturn(destinations);

        Destination result = destinationService.getDestinationByName("Paris");

        assertNotNull(result);
        assertEquals("Paris", result.getDestinationName());
        verify(destinationRepo, times(1)).findByDestinationNameContaining("Paris");
    }

    @Test
    void testGetDestinationByName_NotFound() {
        when(destinationRepo.findByDestinationNameContaining("London")).thenReturn(new ArrayList<>());

        Destination result = destinationService.getDestinationByName("London");

        assertNull(result);
        verify(destinationRepo, times(1)).findByDestinationNameContaining("London");
    }
}
