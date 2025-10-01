package com.mapa.restapi.service;

import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.BookmarkedPlaceRepo;
import com.mapa.restapi.repo.TouristAttractionRepo;
import com.mapa.restapi.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class BookmarkPlaceServiceIntegrationTest {

    @Autowired
    private BookmarkPlaceService bookmarkPlaceService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TouristAttractionRepo touristAttractionRepo;

    @Autowired
    private BookmarkedPlaceRepo bookmarkedPlaceRepo;

    private User testUser;
    private TouristAttraction testAttraction;

    @BeforeEach
    public void setUp() {
        // Setup test user
        testUser = User.builder()
                .email("test@example.com")
                .firstname("Test User")
                .build();
        userRepo.save(testUser);

        // Setup test tourist attraction
        testAttraction = TouristAttraction.builder()
                .name("Test Attraction")
                .longitude(10.0)
                .latitude(20.0)
                .build();
        touristAttractionRepo.save(testAttraction);
    }

    @Test
    public void testAddBookmark() {
        // Act
        int result = bookmarkPlaceService.addBookmark(testUser.getEmail(), testAttraction);

        // Assert
        assertThat(result).isEqualTo(0); // Success code
        List<BookmarkedPlace> bookmarks = bookmarkedPlaceRepo.findByUserID(testUser.getUserid()).orElseThrow();
        assertThat(bookmarks).isNotEmpty();
        assertThat(bookmarks.get(0).getAttraction_id().getName()).isEqualTo(testAttraction.getName());
    }

    @Test
    public void testRemoveBookmark() {
        // First, add a bookmark
        bookmarkPlaceService.addBookmark(testUser.getEmail(), testAttraction);

        // Act
        int result = bookmarkPlaceService.removeBookmark(testAttraction);

        // Assert
        assertThat(result).isEqualTo(0); // Success code
        List<BookmarkedPlace> bookmarks = bookmarkedPlaceRepo.findByUserID(testUser.getUserid()).orElseThrow();
        assertThat(bookmarks).isEmpty(); // Ensure the bookmark is removed
    }

    @Test
    public void testGetBookmarksId() {
        // Add a bookmark first
        bookmarkPlaceService.addBookmark(testUser.getEmail(), testAttraction);

        // Act
        List<Long> bookmarkIds = bookmarkPlaceService.getBookmarksId(testUser.getEmail());

        // Assert
        assertThat(bookmarkIds).isNotEmpty();
        assertThat(bookmarkIds).contains(testAttraction.getApiLocationId());
    }

    @Test
    public void testGetBookmarksPlaces() {
        // Add a bookmark first
        bookmarkPlaceService.addBookmark(testUser.getEmail(), testAttraction);

        // Act
        List<TouristAttractionDTO> bookmarks = bookmarkPlaceService.getBookmarksPlaces(testUser.getEmail());

        // Assert
        assertThat(bookmarks).isNotEmpty();
        assertThat(bookmarks.get(0).getName()).isEqualTo(testAttraction.getName());
    }
}
