package com.mapa.restapi.service;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;

import java.util.List;

public class UserPlanService {
    private User user;
    private List<UserPlan> userPlans;

    // Method to add a plan to the schedule
    public void addPlan(UserPlan plan) {
        userPlans.add(plan);
    }

    // Method to remove a plan from the schedule
    public void removePlan(UserPlan plan) {
        userPlans.remove(plan);
    }

    // Method to get a plan by ID
    public UserPlan getPlanByID(int planID) {
        return userPlans.stream()
                .filter(plan -> plan.getPlanID() == planID)
                .findFirst()
                .orElse(null);
    }

    // Method to list all plans
    public List<UserPlan> getAllPlans() {
        return userPlans;
    }

}
