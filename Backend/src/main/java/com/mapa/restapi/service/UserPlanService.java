package com.mapa.restapi.service;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import com.mapa.restapi.repo.UserPlanRepo;
import com.mapa.restapi.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserPlanService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserPlanRepo userPlanRepo;

    // Method to add a plan to the schedule
    @Transactional
    public void addPlan(UserPlan plan,String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        System.out.println("passed plan: "+plan);
        System.out.println(user);
        UserPlan foundPlan = userPlanRepo.findByUserID(user.getUserid()).orElse(null);
        LocalDate date = LocalDate.now();

        if (foundPlan!=null){
            System.out.println("Plan exist "+foundPlan);
            removePlanByUserID(user);
        }

        UserPlan userPlan = UserPlan.builder()
                    .user(user)
                    .startLocation(plan.getStartLocation())
                    .endLocation(plan.getEndLocation())
                    .startDate(plan.getStartDate())
                    .startTime(plan.getStartTime())
                    .endTime(plan.getEndTime())
                .preference(plan.getPreference())
                .createDate(date)
                    .build();

        userPlanRepo.save(userPlan);
    }

    // Method to remove a plan from the schedule
    public void removePlanByUserID(User user) {
        userPlanRepo.deleteByUserId(user.getUserid());
    }


    // Method to get a plan by ID
    public UserPlan getPlanByID(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("User does not exist"));
        return userPlanRepo.findByUserID(user.getUserid()).orElse(null);
    }


}
