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
public class ApiControllerTest {

    @MockBean
    private UserService userService;

    @InjectMocks
    private ApiController apiController;

    private MockMvc mockMvc;

    ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(apiController).build();
    }

    @Test
    public void testGetUsers() throws Exception {
        User user = new User();
        user.setUserid(1L);
        user.setFirstname("Test User");
        user.setEmail("test@example.com");

        when(userService.getAllUsers()).thenReturn(Collections.singletonList(user));

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstname").value("Test User"))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));

        //Times that userService.getAllUsers() called should equal 1
        verify(userService, times(1)).getAllUsers();
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

        mockMvc.perform(post("/signup")
                        .content(jsonRequest)
                        .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk());    //Expected status code (200)

        verify(userService, times(1)).findByEmail(anyString());
        verify(userService, times(1)).saveUser(any(User.class));
    }

    @Test
    public void testSaveUserEmailExists() throws Exception {
        when(userService.findByEmail(anyString())).thenReturn(new User());

        mockMvc.perform(post("/signup")
                        .contentType("application/json")
                        .content("{\"fisrtname\":\"Test User\", \"email\":\"test@example.com\", \"identifier\":\"testID\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email Already Registered"));

        verify(userService, times(1)).findByEmail(anyString());
        verify(userService, never()).findUserByUserIdentifier(anyString());
        verify(userService, never()).saveUser(any(User.class));
    }


    @Test
    public void testDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser(anyLong());

        mockMvc.perform(delete("/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted"));

        verify(userService, times(1)).deleteUser(anyLong());
    }
}
