package com.mapa.restapi.service;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import com.mapa.restapi.repo.UserPlanRepo;
import com.mapa.restapi.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserPlanServiceUnitTest {

    @InjectMocks
    private UserPlanService userPlanService;

    @Mock
    private UserRepo userRepo;

    @Mock
    private UserPlanRepo userPlanRepo;

    private User user;
    private UserPlan userPlan;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setUserid(1L);
        user.setEmail("test@example.com");

        userPlan = UserPlan.builder()
                .user(user)
                .startLocation("Location A")
                .endLocation("Location B")
                .build();
    }

    @Test
    void testAddPlanWhenNoExistingPlan() {
        // Mock user and repository behavior
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userPlanRepo.findByUserID(1L)).thenReturn(Optional.empty());

        // Call the method
        userPlanService.addPlan(userPlan, "test@example.com");

        // Verify that the plan is saved
        verify(userPlanRepo, times(1)).save(any(UserPlan.class));
        verify(userPlanRepo, never()).deleteByUserId(1L); // Ensure no plan is deleted
    }

    @Test
    void testAddPlanWhenExistingPlan() {
        // Mock user and existing plan
        UserPlan existingPlan = UserPlan.builder().user(user).startLocation("Old Location").build();

        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userPlanRepo.findByUserID(1L)).thenReturn(Optional.ofNullable(existingPlan));

        // Call the method
        userPlanService.addPlan(userPlan, "test@example.com");

        // Verify that the existing plan is removed and the new one is saved
        verify(userPlanRepo, times(1)).deleteByUserId(1L);
        verify(userPlanRepo, times(1)).save(any(UserPlan.class));
    }

    @Test
    void testRemovePlanByUserID() {
        // Call the method
        userPlanService.removePlanByUserID(user);

        // Verify that the plan is deleted
        verify(userPlanRepo, times(1)).deleteByUserId(1L);
    }

    @Test
    void testGetPlanByIDWhenPlanExists() {
        // Mock user and plan
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userPlanRepo.findByUserID(1L)).thenReturn(Optional.ofNullable(userPlan));

        // Call the method
        UserPlan result = userPlanService.getPlanByID("test@example.com");

        // Verify the result
        assertNotNull(result);
        assertEquals("Location A", result.getStartLocation());
        verify(userPlanRepo, times(1)).findByUserID(1L);
    }

    @Test
    void testGetPlanByIDWhenNoPlanExists() {
        // Mock user but no plan
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userPlanRepo.findByUserID(1L)).thenReturn(Optional.empty());

        // Call the method
        UserPlan result = userPlanService.getPlanByID("test@example.com");

        // Verify the result is null
        assertNull(result);
        verify(userPlanRepo, times(1)).findByUserID(1L);
    }

    @Test
    void testGetPlanByIDWhenUserDoesNotExist() {
        // Mock user not found
        when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // Call the method and expect an exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userPlanService.getPlanByID("test@example.com");
        });

        assertEquals("User does not exist", exception.getMessage());
    }
}
