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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class BookmarkPlaceServiceTest {

    @InjectMocks
    private BookmarkPlaceService bookmarkPlaceService;

    @Mock
    private BookmarkedPlaceRepo bookmarkedPlaceRepo;

    @Mock
    private TouristAttractionRepo touristAttractionRepo;

    @Mock
    private UserRepo userRepo;

    @Mock
    private TouristAttractionService touristAttractionService;

    @Mock
    private DestinationRepo destinationRepo;

    private User user;
    private TouristAttraction attraction;
    private BookmarkedPlace bookmarkedPlace;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@example.com");
        user.setUserid(1L);

        attraction = new TouristAttraction();
        attraction.setName("Attraction 1");
        attraction.setApiLocationId(123L);

        bookmarkedPlace = new BookmarkedPlace();
        bookmarkedPlace.setAttraction_id(attraction);
        bookmarkedPlace.setUser(user);
    }

    @Test
    void testAddBookmark() {
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(touristAttractionRepo.findByName(attraction.getName())).thenReturn(Optional.empty());
        when(touristAttractionRepo.save(attraction)).thenReturn(attraction);
        when(bookmarkedPlaceRepo.save(any(BookmarkedPlace.class))).thenReturn(bookmarkedPlace);

        int result = bookmarkPlaceService.addBookmark("test@example.com", attraction);

        assertEquals(0, result); // Verify that the bookmark is added successfully
        verify(touristAttractionRepo, times(1)).save(attraction);
        verify(bookmarkedPlaceRepo, times(1)).save(any(BookmarkedPlace.class));
        verify(destinationRepo, times(1)).save(any(Destination.class));
    }

    @Test
    void testAddBookmark_UserNotFound() {
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            bookmarkPlaceService.addBookmark("test@example.com", attraction);
        });
    }

    @Test
    void testRemoveBookmark_Success() {
        when(touristAttractionRepo.findByName(attraction.getName())).thenReturn(Optional.of(attraction));

        int result = bookmarkPlaceService.removeBookmark(attraction);

        assertEquals(0, result);
        verify(bookmarkedPlaceRepo, times(1)).deleteByAttractionID(attraction.getAttractionID());
    }

    @Test
    void testRemoveBookmark_Fail() {
        when(touristAttractionRepo.findByName(attraction.getName())).thenReturn(Optional.empty());

        int result = bookmarkPlaceService.removeBookmark(attraction);

        assertEquals(1, result); // Fail to remove bookmark
        verify(bookmarkedPlaceRepo, never()).deleteByAttractionID(anyLong());
    }

    @Test
    void testGetBookmarksId_Success() {
        List<BookmarkedPlace> bookmarks = new ArrayList<>();
        bookmarks.add(bookmarkedPlace);

        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(bookmarkedPlaceRepo.findByUserID(user.getUserid())).thenReturn(Optional.of(bookmarks));

        List<Long> bookmarkIds = bookmarkPlaceService.getBookmarksId("test@example.com");

        assertEquals(1, bookmarkIds.size());
        assertEquals(123L, bookmarkIds.get(0));
    }

    @Test
    void testGetBookmarksPlaces_Success() {
        List<BookmarkedPlace> bookmarks = new ArrayList<>();
        bookmarks.add(bookmarkedPlace);
        TouristAttractionDTO dto = new TouristAttractionDTO();
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(bookmarkedPlaceRepo.findByUserID(user.getUserid())).thenReturn(Optional.of(bookmarks));
        when(touristAttractionService.convertToDTO(attraction)).thenReturn(dto);

        List<TouristAttractionDTO> result = bookmarkPlaceService.getBookmarksPlaces("test@example.com");

        assertEquals(1, result.size());
        verify(touristAttractionService, times(1)).convertToDTO(attraction);
    }

    @Test
    void testGetBookmarksPlaces_NoBookmarkFound() {
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(bookmarkedPlaceRepo.findByUserID(user.getUserid())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> bookmarkPlaceService.getBookmarksPlaces("test@example.com"));
    }
}
