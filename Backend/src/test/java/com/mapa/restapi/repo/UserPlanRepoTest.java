package com.mapa.restapi.repo;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
class UserPlanRepoTest {


    private static UserPlanRepo userPlanRepo;


    private static UserRepo userRepo;

    private static User user;

    @BeforeAll
    static void setUp(@Autowired UserRepo userRepoInstance, @Autowired UserPlanRepo userPlanRepoInstance2 ) {
        userRepo=userRepoInstance;
        userPlanRepo = userPlanRepoInstance2;
        user = userRepo.findByEmail("test@test.com").get();
        UserPlan userPlan = UserPlan.builder()
                .startDate(LocalDateTime.now())
                .startLocation("Colombo")
                .endLocation("Kandy")
                .user(user)
                .build();

        userPlanRepo.save(userPlan);
    }

    @AfterAll
    static void tearDown() {
    }


    @Test
    void findUserPlan_by_userID() {
        UserPlan userPlan = userPlanRepo.findByUserID(user.getUserid()).orElse(null);
        assertNotNull(userPlan);
        assert(userPlan.getUser().getUserid()==user.getUserid());
    }

    //Deleting user delete user plan relate to that user
    @Test
    @Transactional
    void delete_userPlan_test() {
        UserPlan userPlan = userPlanRepo.findByUser(user).orElse(null);
        assert userPlan != null;
        userPlanRepo.deleteById(userPlan.getPlanID());
        userPlan = userPlanRepo.findByPlanID(userPlan.getPlanID()).orElse(null);
        assertNull(userPlan);

    }

}