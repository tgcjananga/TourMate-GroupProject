package com.mapa.restapi.service;

import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.repo.TouristAttractionRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TouristAttractionServiceTest {

    @InjectMocks
    private TouristAttractionService touristAttractionService;

    @Mock
    private TouristAttractionRepo touristAttractionRepo;

    private TouristAttraction touristAttraction;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        touristAttraction = new TouristAttraction();
        touristAttraction.setAttractionID(1L);
        touristAttraction.setName("Eiffel Tower");
        touristAttraction.setCity("Paris");
        touristAttraction.setType("Monument");

    }

    @Test
    void testGetTouristAttraction() {
        List<TouristAttraction> attractions = new ArrayList<>();
        attractions.add(touristAttraction);

        when(touristAttractionRepo.findAll()).thenReturn(attractions);

        List<TouristAttractionDTO> result = touristAttractionService.getTouristAttraction();

        assertEquals(1, result.size());
        assertEquals("Eiffel Tower", result.get(0).getName());
        verify(touristAttractionRepo, times(1)).findAll();
    }

    @Test
    void testGetAttractionsTypes() {
        TouristAttraction attraction = TouristAttraction.builder().attractionID(2L).city("Paris").type("Museum, Art").build();
        List<TouristAttraction> attractions = Arrays.asList(
                touristAttraction,
                attraction
        );

        when(touristAttractionRepo.findAll()).thenReturn(attractions);

        List<String> result = touristAttractionService.getAttractionsTypes();

        Set<String> expectedTypes = new HashSet<>(Arrays.asList("Monument", "Museum", "Art"));
        assertEquals(expectedTypes.size(), result.size());
        assertTrue(result.containsAll(expectedTypes));

        verify(touristAttractionRepo, times(1)).findAll();
    }

    @Test
    void testSuggestPlaces() {
        TouristAttraction attraction = TouristAttraction.builder().attractionID(2L).city("Paris").type("Museum, Art").name("Louvre Museum").build();

        List<TouristAttraction> attractions = Arrays.asList(
                touristAttraction,
                attraction
        );

        when(touristAttractionRepo.findByCityAndPreferences("Paris", "Monument")).thenReturn(Arrays.asList(touristAttraction));
        when(touristAttractionRepo.findByCityAndPreferences("Paris", "Museum")).thenReturn(Arrays.asList(attractions.get(1)));

        List<String> preferences = Arrays.asList("Monument", "Museum");
        List<String> cities = Arrays.asList("Paris");

        List<TouristAttractionDTO> result = touristAttractionService.suggestPlaces(preferences, cities);

        assertEquals(2, result.size());
        assertEquals("Eiffel Tower", result.get(0).getName());
        assertEquals("Louvre Museum", result.get(1).getName());

        verify(touristAttractionRepo, times(1)).findByCityAndPreferences("Paris", "Monument");
        verify(touristAttractionRepo, times(1)).findByCityAndPreferences("Paris", "Museum");
    }


}
