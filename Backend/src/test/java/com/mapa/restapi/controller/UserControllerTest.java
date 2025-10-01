package com.mapa.restapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mapa.restapi.dto.UserDto;
import com.mapa.restapi.model.User;
import com.mapa.restapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerTest {

    @MockBean
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }


    @Test
    public void testSaveUserSuccess() throws Exception {
        User user = new User();
        user.setUserid(1L);
        user.setFirstname("Test User");
        user.setEmail("test@example.com");
        user.setIdentifier("testID");

        UserDto userDto = UserDto.builder().firstname(user.getFirstname()).build();
        String jsonRequest = objectMapper.writeValueAsString(user); //Convert user into jason format

        //What will userService return
        when(userService.findByEmail(anyString())).thenReturn(null);
        when(userService.saveUser(any(User.class))).thenReturn(userDto);

        mockMvc.perform(post("/auth/signup")
                        .content(jsonRequest)
                        .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk());    //Expected status code (200)

        verify(userService, times(1)).findByEmail(anyString());
        verify(userService, times(1)).saveUser(any(User.class));
    }

    @Test
    public void testSaveUserEmailExists() throws Exception {
        when(userService.findByEmail(anyString())).thenReturn(new User());

        mockMvc.perform(post("/auth/signup")
                        .contentType("application/json")
                        .content("{\"fisrtname\":\"Test User\", \"email\":\"test@example.com\", \"identifier\":\"testID\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email Already Registered"));

        verify(userService, times(1)).findByEmail(anyString());
        verify(userService, never()).saveUser(any(User.class));
    }

}
