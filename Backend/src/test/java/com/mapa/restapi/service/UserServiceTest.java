package com.mapa.restapi.service;


import com.mapa.restapi.dto.UserDto;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.UserRepo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/*
This is Unit Test for UserService in Service layer. It use Mockito to bypass UserRepo and Database interaction.
This is only testing UserService methods. Assume UserRepo is already Test properly.
 */
@SpringBootTest
class UserServiceTest {

    @MockBean
    private UserRepo userRepo;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;


    private  static  User user;

    @BeforeAll
    static void setUp(@Autowired UserRepo userRepoInstance) {
        user = User.builder()
                .firstname("John")
                .lastname("Doe")
                .age(30)
                .email("john.doe@example.com")
                .gender("male")
                .usertype("local")
                .identifier("1234v")
                .password("securepassword") // Use a more realistic password
                .build();

    }


    @Test
    void getAllUsersTest() {

        User user2 = new User();
        user2.setEmail("jane.doe@example.com");
        user2.setFirstname("Jane");
        user2.setLastname("Doe");
        user2.setIdentifier("1234v");
        user2.setPassword("securepassword");

        when(userRepo.findAll()).thenReturn(Arrays.asList(user, user2));

        List<User> users = userService.getAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
        verify(userRepo, times(1)).findAll();
    }

    @Test
    void saveUserTest() {
        when(userRepo.findByEmail(user.getEmail())).thenReturn(Optional.ofNullable(user));
        UserDto userDto = userService.saveUser(user);
        assertNotNull(userDto);
        verify(userRepo, times(1)).save(user);
    }


    @Test
    void findUserByEmailTest() {

        when(userRepo.findByEmail(anyString())).thenReturn(Optional.ofNullable(user));

        User foundUser = userService.findByEmail("john.doe@example.com");

        assertNotNull(foundUser);
        assertEquals("john.doe@example.com", foundUser.getEmail());
    }

    @Test
    void findUserByUserIdentifierTest() {

        when(userRepo.getByIdentifier(anyString())).thenReturn(Optional.ofNullable(user));

        User foundUser = userService.findUserByUserIdentifier("1234v");

        assertNotNull(foundUser);
        assertEquals("1234v", foundUser.getIdentifier());
        verify(userRepo, times(1)).getByIdentifier(anyString());
    }

    @Test
    void deleteUserTest() {
        doNothing().when(userRepo).deleteById(anyLong());

        userService.deleteUser(1L);

        verify(userRepo, times(1)).deleteById(anyLong());
    }


}
