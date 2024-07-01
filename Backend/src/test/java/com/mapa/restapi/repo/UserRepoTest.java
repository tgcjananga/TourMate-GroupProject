package com.mapa.restapi.repo;

import com.mapa.restapi.model.User;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


/*
This is Unit Test for UserRepo class in Repository layer
 */
@SpringBootTest
class UserRepoTest {

    // Autowired UserRepo instance
    @Autowired
    private static UserRepo userRepo;

    // Static user instance to be used in tests
    private static User user;

    /**
     * This method sets up the test environment.
     * It runs once before all the tests.
     */
    @BeforeAll
    static void setUp(@Autowired UserRepo userRepoInstance) {
        userRepo = userRepoInstance;
        user = User.builder()
                .firstname("John")
                .lastname("Doe")
                .age(30)
                .email("john.doe@example.com")
                .gender("male")
                .usertype("solo")
                .identifier("1234v")
                .password("securepassword") // Use a more realistic password
                .build();
        userRepo.save(user);
    }

    /**
     * This method cleans up the test environment.
     * It runs once after all the tests.
     */
    @AfterAll
    static void tearDown() {
        userRepo.delete(user);
    }

    /**
     * Test for retrieving a user by email.
     * It checks if the user with the given email exists.
     */
    @Test
    void getByEmail_valid_test() {
        Optional<User> foundUser = userRepo.findByEmail("john.doe@example.com");
        assertTrue(foundUser.isPresent());
        assertEquals("john.doe@example.com", foundUser.get().getEmail());
        assertEquals("John", foundUser.get().getFirstname());
        assertEquals("Doe", foundUser.get().getLastname());
    }

    @Test
    void getByEmail_invalid_test() {
        Optional<User> foundUser = userRepo.findByEmail("john1.doe@example.com");
        assertFalse(foundUser.isPresent());

    }

    /**
     * Test for retrieving a user by identifier (NIC/ Passport).
     * It checks if the user with the given email exists.
     */

    @Test
    void getByIdentifier_valid_test() {
        Optional<User> foundUser = userRepo.findByEmail("john.doe@example.com");
        assertTrue(foundUser.isPresent());
        assertEquals("john.doe@example.com", foundUser.get().getEmail());

    }

    @Test
    void getByIdentifier_invalid_test() {
        Optional<User> foundUser = userRepo.findByEmail("wrong.doe@example.com");
        assertFalse(foundUser.isPresent());

    }

    /**
     * Test for saving a new user.
     * It checks if the user is saved and the data is correct.
     */
    @Test
    void saveUserTest() {
        User newUser = User.builder()
                .firstname("Hello")
                .lastname("Test")
                .age(50)
                .email("hello@gmail.com")
                .gender("male")
                .usertype("solo")
                .identifier("123456v")
                .password("1234")
                .build();
        User savedUser = userRepo.save(newUser);
        assertEquals("Hello", savedUser.getFirstname());
        assertEquals("Test", savedUser.getLastname());
        userRepo.delete(savedUser);     //Delete save user to keep database unaffected
    }

    @Test
    void saveUser_alreadyExistEmail_Test() {
        User newUser = User.builder()
                .firstname("Hello")
                .lastname("Test")
                .age(50)
                .email("john.doe@example.com")
                .gender("male")
                .usertype("solo")
                .identifier("12345678v")
                .password("1234")
                .build();



        Exception exception = assertThrows(DataIntegrityViolationException.class, () -> {
            userRepo.save(newUser);
        });

        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains("constraint [user.UKob8kqyqqgmefl0aco34akdtpe]"));

        userRepo.delete(newUser);
    }



}
