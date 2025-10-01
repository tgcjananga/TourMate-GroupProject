package com.mapa.restapi.service;

import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.Destination;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.BookmarkedPlaceRepo;
import com.mapa.restapi.repo.DestinationRepo;
import com.mapa.restapi.repo.TouristAttractionRepo;
import com.mapa.restapi.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkPlaceService {

    @Autowired
    private BookmarkedPlaceRepo bookmarkedPlaceRepo;

    @Autowired
    private TouristAttractionRepo touristAttractionRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TouristAttractionService touristAttractionService;

    @Autowired
    private DestinationRepo destinationRepo;


    @Transactional
    public int addBookmark(String email,TouristAttraction attraction){

        LocalDate date = LocalDate.now();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        TouristAttraction existAttraction = touristAttractionRepo.findByName(attraction.getName()).orElse(null);

        if(existAttraction==null){
            existAttraction = touristAttractionRepo.save(attraction);
        }

        BookmarkedPlace bookmarkedPlace = BookmarkedPlace.builder()
                    .user(user)
                    .attraction_id(existAttraction)
                    .date(date).
                    build();
        Destination destination = Destination.builder()
                .destinationName(attraction.getName())
                .longitude(attraction.getLongitude())
                .latitude(attraction.getLatitude()).build();
        destinationRepo.save(destination);

        bookmarkedPlaceRepo.save(bookmarkedPlace);

        return 0; //Added bookmark succesfully
    }

    @Transactional
    public int removeBookmark(TouristAttraction attraction) {
        TouristAttraction existAttraction = touristAttractionRepo.findByName(attraction.getName()).orElse(null);
        if(existAttraction==null){return 1;} // fail to remove
        bookmarkedPlaceRepo.deleteByAttractionID(existAttraction.getAttractionID());
        return 0;
    }

    @Transactional
    public List<Long> getBookmarksId(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<BookmarkedPlace> bookmarks = bookmarkedPlaceRepo.findByUserID(user.getUserid()).orElse(null);
        if (bookmarks.isEmpty()) {
            System.out.println("No bookmarks found");
            return null;
        }
        System.out.println(bookmarks);
        List<Long> bookmarkIDs = new ArrayList<>();
        for (BookmarkedPlace place : bookmarks) {
           bookmarkIDs.add(place.getAttraction_id().getApiLocationId());
        }

        return bookmarkIDs;

    }

    @Transactional
    public List<TouristAttractionDTO> getBookmarksPlaces(String email) {
        // Find the user by email, or throw an exception if the user is not found
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find bookmarked places for the user
        List<BookmarkedPlace> bookmarks = bookmarkedPlaceRepo.findByUserID(user.getUserid())
                .orElseThrow(() -> new RuntimeException("No bookmark found"));

        // Extract the tourist attractions from the bookmarks and map them to DTOs
        return bookmarks.stream()
                .map(bookmark -> {
                    TouristAttraction attraction = bookmark.getAttraction_id();
                    return touristAttractionService.convertToDTO(attraction);

                })
                .collect(Collectors.toList());
    }

}