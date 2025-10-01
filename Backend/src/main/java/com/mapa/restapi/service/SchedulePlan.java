//package com.mapa.restapi.service;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import com.mapa.restapi.dto.ScheduleEventDto;
//import com.mapa.restapi.exception.SchedulePlanException;
//import com.mapa.restapi.model.*;
//import com.mapa.restapi.repo.ScheduleEventRepo;
//import com.mapa.restapi.repo.UserPlanRepo;
//import com.mapa.restapi.repo.UserRepo;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.*;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Service
//public class SchedulePlan {
//
//    private String email;
//
//    @Autowired
//    private UserRepo userRepo;
//
//    @Autowired
//    private UserPlanRepo userPlanRepo;
//
//    @Autowired
//    private BookmarkPlaceService bookmarkPlaceService;
//
//    @Autowired
//    private RouteService routeService;
//
//    @Autowired
//    private ScheduleEventRepo scheduleEventRepo;
//
//    // Method to get the relevant user plan from the database
//    public UserPlan getUserPlan(long userid) throws SchedulePlanException {
//        return userPlanRepo.findByUserID(userid).orElseThrow(() -> new SchedulePlanException("No Plan found for user: " + userid));
//    }
//
//    // Method to get bookmarked places from the database
//    public List<TouristAttraction> getUserBookmarkPlace(long userid) {
//        return bookmarkPlaceService.findAttractionPlaces(userid);
//    }
//
//    // Method to generate the schedule based on routes and time spent at locations
//    public String generateSchedule(String email) throws Exception {
//        // Retrieve user and user plan from the database
//        User user = userRepo.findByEmail(email).orElseThrow();
//        UserPlan userPlan = getUserPlan(user.getUserid());
//
//        // Retrieve bookmarked places from the database
//        List<TouristAttraction> bookmarkedPlaces = getUserBookmarkPlace(user.getUserid());
//
//        Map<String, Integer> travelTimes = new HashMap<>();
//
//        // Initialize variables for scheduling
//        LocalTime currentTime = userPlan.getStartTime();
//        LocalDate currentDate = userPlan.getStartDate();
//        LocalDate endDate = userPlan.getEndDate();
//        String currentLocation = userPlan.getStartLocation();
//        LocalTime endTime = userPlan.getEndTime();
//
//        // Retrieve route information (placeholder for actual API integration)
//        Set<String> routeLocations = routeService.getCitiesAlongRoute(userPlan.getStartLocation(), userPlan.getEndLocation());
//
//        // Filter bookmarked places based on the route
//        List<TouristAttraction> filteredPlaces = filterPlacesByCity(bookmarkedPlaces, routeLocations);
//
//        // Calculate travel times for filtered places
//        for (TouristAttraction place : filteredPlaces) {
//            int duration = calculateTravelTime(currentLocation, place.getCity());
//            travelTimes.put(place.getCity(), duration);
//        }
//
//        // Debug: Print travel times
//        System.out.println("City : Travel Time From " + currentLocation);
//        for (Map.Entry<String, Integer> travel : travelTimes.entrySet()) {
//            System.out.println(travel.getKey() + " : " + travel.getValue() + " Min");
//        }
//        System.out.println();
//
//        // Sort places by travel time
//        List<TouristAttraction> sortedPlaces = sortPlacesByTravelTime(travelTimes, filteredPlaces);
//
//        // Debug: Print sorted places
//        System.out.println("---------------Sorted Places--------------");
//        for (TouristAttraction place : sortedPlaces) {
//            System.out.println(place.getCity());
//        }
//        System.out.println();
//
//        // Generate the schedule
//        List<ScheduleEventDto> schedule = new ArrayList<>();
//        int travelTimeToPrevPoint = 0;
//
//        while (currentDate.isBefore(endDate)) {
//            ScheduleEventDto event = new ScheduleEventDto();
//
//            // Select the next place to visit
//            TouristAttraction nextPlace = selectNextPlace(currentLocation, sortedPlaces, currentTime, endTime);
//            if (nextPlace == null) break;
//
//            // Calculate travel time and visit duration
//            int travelTime = travelTimes.get(nextPlace.getCity()) - travelTimeToPrevPoint;
//            event.setTravelTime(travelTime / 60);
//            int visitDuration = calculateVisitTime(nextPlace.getType());
//            travelTimeToPrevPoint += travelTime;
//
//            LocalTime visitEndTime = currentTime.plusMinutes(travelTime + visitDuration);
//
//            // Check if visit end time is after the day's end time
//            if (visitEndTime.isAfter(endTime)) {
//                currentDate = currentDate.plusDays(1);
//                currentTime = userPlan.getStartTime();
//                visitEndTime = currentTime.plusMinutes(travelTime + visitDuration);
//            }
//
//            // Set event details
//            event.setPlace(nextPlace.getName());
//            event.setStartTime(currentTime);
//            event.setEndTime(visitEndTime);
//            event.setDate(currentDate);
//            schedule.add(event);
//
//            // Update current time and location for next iteration
//            currentTime = visitEndTime;
//            currentLocation = nextPlace.getCity();
//            sortedPlaces.remove(nextPlace);
//        }
//
//        // Debug: Print generated schedule
//        System.out.println("------------------ Schedule ----------------------------");
//        for (ScheduleEventDto events : schedule) {
//            System.out.println("Place :" + events.getPlace() + " | Date :" + events.getDate() + " | Start :" + events.getStartTime() + " | End :" + events.getEndTime() + " | TravelTime :" + events.getTravelTime() + " h");
//        }
//        System.out.println("------------------ Schedule ----------------------------");
//        if (!sortedPlaces.isEmpty()) {
//            System.out.println("There is more place to visit. But not enough time you provided");
//        }
//
//        // Convert schedule to JSON
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.registerModule(new JavaTimeModule());
//        try {
//            return objectMapper.writeValueAsString(schedule);
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//    // Method to filter places based on the route
//    private List<TouristAttraction> filterPlacesByCity(List<TouristAttraction> bookmarkPlaces, Set<String> routeCity) {
//        List<TouristAttraction> filterPlace = new ArrayList<>();
//        for (TouristAttraction place : bookmarkPlaces) {
//            if (routeCity.contains(place.getCity())) {
//                filterPlace.add(place);
//            }
//        }
//        return filterPlace;
//    }
//
////    private List<TouristAttraction> filterPlacesByCoord(List<TouristAttraction> bookmarkPlaces) {
////        List<double[]> waypoints = routeService.extractWaypoints()
////        List<TouristAttraction> filterPlace = new ArrayList<>();
////        for (TouristAttraction place : bookmarkPlaces) {
////            if (routeCity.contains(place.getCity())) {
////                filterPlace.add(place);
////            }
////        }
////        return filterPlace;
////    }
//
//    // Method to sort places by travel time
//    public List<TouristAttraction> sortPlacesByTravelTime(Map<String, Integer> travelTimes, List<TouristAttraction> filteredPlaces) {
//        // Convert the map entries to a list and sort by travel time
//        List<Map.Entry<String, Integer>> entryList = new ArrayList<>(travelTimes.entrySet());
//        entryList.sort(Map.Entry.comparingByValue());
//
//        // Create a sorted list of attractions based on travel time
//        List<String> sortedCity = new ArrayList<>();
//        for (Map.Entry<String, Integer> entry : entryList) {
//            sortedCity.add(entry.getKey());
//        }
//
//        List<TouristAttraction> sortedAttraction = new ArrayList<>();
//        for (String s : sortedCity) {
//            for (TouristAttraction attraction : filteredPlaces) {
//                if (Objects.equals(s, attraction.getCity())) {
//                    sortedAttraction.add(attraction);
//                }
//            }
//        }
//
//        return sortedAttraction;
//    }
//
//    // Placeholder for route information retrieval from map API
//    private Set<String> getRouteInfo(String startLocation, String endLocation) throws Exception {
//        // Implement actual API call here and return route information
//        return routeService.getCitiesAlongRoute(startLocation, endLocation);
//    }
//
//    // Method to select the next place to visit
//    private TouristAttraction selectNextPlace(String currentLocation, List<TouristAttraction> places, LocalTime currentTime, LocalTime endTime) {
//        // Select the next place to visit based on proximity, interest, and remaining time
//        if (places.isEmpty()) {
//            return null;
//        }
//        return places.get(0);
//    }
//
//    // Method to calculate travel time using a map API
//    public int calculateTravelTime(String startLocation, String endLocation) {
//        if (Objects.equals(startLocation, endLocation)) {
//            return 0;
//        }
//        Map<String, Double> data = routeService.extractDistanceAndDuration(startLocation, endLocation);
//        return data.get("Distance").intValue(); // Return travel time in minutes
//    }
//
//    // Method to calculate visit time based on location type
//    private int calculateVisitTime(String locationType) {
//        // Placeholder logic to calculate visit time; can be expanded as needed
//        return 60; // Default visit duration is 60 minutes
//    }
//}
