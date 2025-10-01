package com.mapa.restapi.controller;

import com.mapa.restapi.dto.SuggestPlaceRequest;
import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.service.BookmarkPlaceService;
import com.mapa.restapi.service.TouristAttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*",allowedHeaders = "*")
@RequestMapping("/api")
public class EntityController {

    @Autowired
    private TouristAttractionService touristAttractionService;
    @Autowired
    private BookmarkPlaceService bookmarkPlaceService;

    @GetMapping("/attractions/getTypes")
    public ResponseEntity<List<String>> getDestinationTypes() {

        List<String> typesSet =touristAttractionService.getAttractionsTypes ();

        return ResponseEntity.ok(typesSet); // Return the set wrapped in ResponseEntity
    }

    @GetMapping("/bookmarks/getplaces")
    public ResponseEntity<List<TouristAttractionDTO>> getBookmarkedPlaces(@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        List<TouristAttractionDTO> bookmarkedPlaces = bookmarkPlaceService.getBookmarksPlaces(username);
        return ResponseEntity.ok(bookmarkedPlaces);
    }

    @GetMapping("/attractions/getall")
    public ResponseEntity<List<TouristAttractionDTO>> getPlaces(){
        return ResponseEntity.ok( touristAttractionService.getTouristAttraction());
    }


    @PostMapping("/attractions/suggestplaces")
    public ResponseEntity<List<TouristAttractionDTO>> getSuggestPlaces(@RequestBody SuggestPlaceRequest request){
        List<String> cities = request.getCities();
        List<String> preference = request.getPreference();

        return ResponseEntity.ok(touristAttractionService.suggestPlaces(preference,cities));
    }

}
