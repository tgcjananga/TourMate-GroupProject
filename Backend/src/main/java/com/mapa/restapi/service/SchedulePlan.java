package com.mapa.restapi.service;

import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.PlanItems;
import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchedulePlan {
    private int scheduleID;
    private User user;
    private UserPlan userPlans;
    
    //get relevant user plan from database
    public UserPlan getUserPlan(long userid){
        return null;
    }

    //get bookmarked places from database
    public BookmarkedPlace getUserBookmarkPlace(long userid){
        return null;
    }

    // Method to generate the schedule based on routes and time spent at locations
    public void generateSchedule() {

            UserPlan plan = getUserPlan(user.getUserid());
            BookmarkedPlace bookmark = getUserBookmarkPlace(user.getUserid());

            // calling a method like getRouteInfo(plan.getStartLocation(), plan.getEndLocation())
            // and then calculate the time needed for the entire plan including time spent at each location
            // This is a placeholder for actual API integration and calculation logic
            String routeInfo = getRouteInfo(plan.getStartLocation(), plan.getEndLocation());
            plan.setRouteInfo(routeInfo);
            calculateTime(plan);

            /*
            Logic for Schedule generate goes here
                - Consider
                    -Time availability
                    -User bookmarked places

                -Give Hotels , Restaurants from database
             */

    }

    // Placeholder for route information retrieval from map API
    private String getRouteInfo(String startLocation, String endLocation) {
        // Implement actual API call here and return route information
        return "Route info from " + startLocation + " to " + endLocation;
    }

    // Placeholder for time calculation logic
    private void calculateTime(UserPlan plan) {
        // Implement actual time calculation logic based on route and time spent at locations
        long totalTime = 0;
        for (PlanItems item : plan.getPlanItems()) {
            totalTime += getTimeSpentAtLocation(item);
        }
        plan.setTotalTime(totalTime);
    }

    // Placeholder for time spent at location retrieval
    private long getTimeSpentAtLocation(PlanItems item) {
        // Implement actual time spent calculation here
        return 30; // assuming 30 minutes spent at each location as a placeholder
    }
}
