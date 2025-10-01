package com.mapa.restapi.service;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import com.mapa.restapi.repo.UserPlanRepo;
import com.mapa.restapi.repo.UserRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserPlanServiceIntegrationTest {

    @Autowired
    private UserPlanService userPlanService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserPlanRepo userPlanRepo;

    @Test
    void testAddPlanAndFetchPlan() {
        // Setup the user
        User user = new User();
        user.setEmail("test@example.com");
        userRepo.save(user);

        // Setup the plan
        UserPlan userPlan = UserPlan.builder()
                .user(user)
                .startLocation("Location A")
                .endLocation("Location B")
                .build();

        // Add the plan
        userPlanService.addPlan(userPlan, "test@example.com");

        // Fetch the plan and assert it's saved correctly
        UserPlan fetchedPlan = userPlanService.getPlanByID("test@example.com");
        assertNotNull(fetchedPlan);
        assertEquals("Location A", fetchedPlan.getStartLocation());
        assertEquals("Location B", fetchedPlan.getEndLocation());
    }

    @Test
    void testRemovePlan() {
        // Setup the user
        User user = new User();
        user.setEmail("test@example.com");
        userRepo.save(user);

        // Setup the plan
        UserPlan userPlan = UserPlan.builder()
                .user(user)
                .startLocation("Location A")
                .endLocation("Location B")
               .build();

        // Add the plan
        userPlanService.addPlan(userPlan, "test@example.com");

        // Remove the plan
        userPlanService.removePlanByUserID(user);

        // Assert that the plan no longer exists
        UserPlan deletedPlan = userPlanRepo.findByUserID(user.getUserid()).orElse(null);
        assertNull(deletedPlan);
    }
}
