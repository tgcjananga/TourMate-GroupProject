package com.mapa.restapi.service;

import com.mapa.restapi.dto.ScheduleEventDto;
import com.mapa.restapi.model.*;
import com.mapa.restapi.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ScheduleEventService {

    @Autowired
    private ScheduleEventRepo scheduleEventRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RestaurantRepo restaurantRepo;

    @Autowired
    private HotelRepo hotelRepo;


    @Transactional
    public int addScheduleEvent(String email, ScheduleEvent scheduleEvent) {
        // Find the user by email
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        // Associate the user with the schedule event
        scheduleEvent.setUser(user);

        // Associate the stops with the schedule event
        if (scheduleEvent.getStops() != null) {
            for (Stop stop : scheduleEvent.getStops()) {
                stop.setScheduleEvent(scheduleEvent);
            }
        }

        // Associate the schedule restaurants with the schedule event
        if (scheduleEvent.getScheduleRestaurants() != null) {
            for (ScheduleRestaurant scheduleRestaurant : scheduleEvent.getScheduleRestaurants()) {
                scheduleRestaurant.setScheduleEvent(scheduleEvent);
            }
        }

        // Associate the schedule hotels with the schedule event
        if (scheduleEvent.getScheduleHotels() != null) {
            for (ScheduleHotel scheduleHotel : scheduleEvent.getScheduleHotels()) {
                scheduleHotel.setScheduleEvent(scheduleEvent);
            }
        }

        // Save the schedule event, hotels, restaurants, and associated stops to the repository
        scheduleEventRepo.save(scheduleEvent);

        return 0; // Success
    }


    public List<ScheduleEventDto> getAllSchedules(String username) {
        User user=userRepo.findByEmail(username).orElseThrow(()->new RuntimeException("No user found"));
        List<ScheduleEvent> scheduleEvents = scheduleEventRepo.findScheduleEventByUserID(user.getUserid());
        if (scheduleEvents.isEmpty()){
            return new ArrayList<>();
        }
        return scheduleEvents.stream().map(this::convertDto).collect(Collectors.toList());
    }

    public ScheduleEvent getScheduleById(Long scheduleId) {
        return scheduleEventRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
    }

    public ScheduleEventDto convertDto(ScheduleEvent scheduleEvent){
        return ScheduleEventDto.builder()
                .scheduleId(scheduleEvent.getScheduleId())
                .endLocation(scheduleEvent.getEndLocation())
                .startLocation(scheduleEvent.getStartLocation())
                .stops(scheduleEvent.getStops())
                .hotels(scheduleEvent.getScheduleHotels())
                .restaurants(scheduleEvent.getScheduleRestaurants())
                .endTime(scheduleEvent.getEndTime())
                .startTime(scheduleEvent.getStartTime())
                .mapUrl(scheduleEvent.getMapUrl())
                .build();

    }

    // Delete a schedule by its scheduleId
    @Transactional
    public int deleteScheduleById(String email, Long scheduleId) {

        // Retrieve the schedule by its ID from the repository
        // If the schedule does not exist, throw an exception
        ScheduleEvent scheduleEvent = scheduleEventRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
        
        // Check if the email of the user making the request matches the email associated with the schedule
        if (Objects.equals(scheduleEvent.getUser().getEmail(), email)) {
            // If the emails match, proceed to delete the schedule
            scheduleEventRepo.deleteById(scheduleId);
            // Return 0 to indicate successful deletion
            return 0;
        } else {
            // If the emails don't match, return 1 to indicate failure (unauthorized access)
            return 1;
        }
    }

}
