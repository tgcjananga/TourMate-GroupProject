package com.mapa.restapi.repo;

import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
class BookmarkedPlaceRepoTest {

    @Autowired
    private BookmarkedPlaceRepo bookmarkedPlaceRepo;

    @Autowired
    private UserRepo userRepo;

    private User testUser;
    private BookmarkedPlace bookmarkedPlace;

    @BeforeEach
    void setUp() {
        // Create and save a test user if it doesn't already exist
        testUser = userRepo.findByEmail("test@test.com").orElseGet(() -> {
            User user = new User();
            user.setEmail("test@test.com");
            user.setFirstname("Test User");
            return userRepo.save(user);
        });

        // Create and save a bookmarked place
        bookmarkedPlace = BookmarkedPlace.builder()
                .user(testUser)
                .date(LocalDate.now())
                .build();
        bookmarkedPlaceRepo.save(bookmarkedPlace);
    }

    @AfterEach
    void tearDown() {
        // Clean up after each test
        bookmarkedPlaceRepo.delete(bookmarkedPlace);
    }

    @Test
    public void findBookmarkedPlace_by_userID() {
        // Act: Retrieve bookmarked places for the test user
        List<BookmarkedPlace> places = bookmarkedPlaceRepo.findByUserID(testUser.getUserid()).orElse(null);

        // Assert
        assertNotNull(places);
        assertEquals(1, places.size()); // Ensure only one place is found
        assertEquals(bookmarkedPlace.getUser().getUserid(), places.get(0).getUser().getUserid());
    }
}
