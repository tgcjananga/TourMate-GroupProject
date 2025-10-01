package com.mapa.restapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mapa.restapi.dto.LoginDto;
import com.mapa.restapi.dto.UserDto;
import com.mapa.restapi.model.User;
import com.mapa.restapi.security.jwt.JwtUtils;
import com.mapa.restapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock the authentication and security context
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void testLoginSuccess() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("test@gmail.com");
        loginDto.setPassword("testPassword");

        String jsonRequest = objectMapper.writeValueAsString(loginDto);

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mockJwtToken");

        mockMvc.perform(post("/auth/login")
                        .content(jsonRequest)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("mockJwtToken"));

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils, times(1)).generateJwtToken(authentication);
    }

    @Test
    public void testSaveUserSuccess() throws Exception {
        User user = new User();
        user.setUserid(1L);
        user.setFirstname("Test User");
        user.setEmail("test@example.com");
        user.setIdentifier("testID");

        UserDto userDto = UserDto.builder().firstname(user.getFirstname()).build();
        String jsonRequest = objectMapper.writeValueAsString(user); // Convert user into JSON format

        // What will userService return
        when(userService.findByEmail(anyString())).thenReturn(null);
        when(userService.saveUser(any(User.class))).thenReturn(userDto);

        mockMvc.perform(post("/auth/signup")
                        .content(jsonRequest)
                        .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk()); // Expected status code (200)

        verify(userService, times(1)).findByEmail(anyString());
        verify(userService, times(1)).saveUser(any(User.class));
    }

    @Test
    public void testSaveUserEmailExists() throws Exception {
        when(userService.findByEmail(anyString())).thenReturn(new User());

        mockMvc.perform(post("/auth/signup")
                        .contentType("application/json")
                        .content("{\"firstname\":\"Test User\", \"email\":\"test@example.com\", \"identifier\":\"testID\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email Already Registered"));

        verify(userService, times(1)).findByEmail(anyString());
        verify(userService, never()).saveUser(any(User.class));
    }
}
