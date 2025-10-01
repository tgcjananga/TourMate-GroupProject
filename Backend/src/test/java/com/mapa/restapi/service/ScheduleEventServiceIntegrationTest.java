package com.mapa.restapi.service;

import com.mapa.restapi.model.ScheduleEvent;
import com.mapa.restapi.model.Stop;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.ScheduleEventRepo;
import com.mapa.restapi.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest // To load the full application context
@Transactional   // Ensures the database is rolled back after each test
public class ScheduleEventServiceIntegrationTest {

    @Autowired
    private ScheduleEventService scheduleEventService;

    @Autowired
    private ScheduleEventRepo scheduleEventRepo;

    @Autowired
    private UserRepo userRepo;

    private User testUser;

    @BeforeEach
    public void setUp() {
        // Create a test user for the schedule
        testUser = new User();
        testUser.setFirstname("John");
        testUser.setLastname("Doe");
        testUser.setEmail("john.doe@example.com");
        userRepo.save(testUser);
    }

    @Test
    public void testAddScheduleEvent() {
        // Create a new ScheduleEvent object
        ScheduleEvent scheduleEvent = new ScheduleEvent();
        scheduleEvent.setStartLocation("New York");
        scheduleEvent.setEndLocation("Los Angeles");

        // Adding stops to the schedule event
        List<Stop> stops = new ArrayList<>();
        Stop stop1 = new Stop();
        stop1.setFromLocation("Chicago");
        stops.add(stop1);
        scheduleEvent.setStops(stops);

        // Add the schedule event for the user
        int result = scheduleEventService.addScheduleEvent(testUser.getEmail(), scheduleEvent);
        assertEquals(0, result);  // Check if the operation was successful

        // Retrieve the saved schedule event from the database
        List<ScheduleEvent> savedSchedules = scheduleEventRepo.findScheduleEventByUserID(testUser.getUserid());
        assertNotNull(savedSchedules);
        assertEquals(1, savedSchedules.size());

        ScheduleEvent savedSchedule = savedSchedules.get(0);
        assertEquals("New York", savedSchedule.getStartLocation());
        assertEquals("Los Angeles", savedSchedule.getEndLocation());
        assertEquals(1, savedSchedule.getStops().size());
        assertEquals("Chicago", savedSchedule.getStops().get(0).getFromLocation());
    }

    @Test
    public void testGetScheduleById() {
        // Create and save a schedule event
        ScheduleEvent scheduleEvent = new ScheduleEvent();
        scheduleEvent.setStartLocation("San Francisco");
        scheduleEvent.setEndLocation("Seattle");
        scheduleEvent.setUser(testUser);
        scheduleEventRepo.save(scheduleEvent);

        // Retrieve the schedule by its ID
        ScheduleEvent retrievedSchedule = scheduleEventService.getScheduleById(scheduleEvent.getScheduleId());
        assertNotNull(retrievedSchedule);
        assertEquals("San Francisco", retrievedSchedule.getStartLocation());
        assertEquals("Seattle", retrievedSchedule.getEndLocation());
    }

    @Test
    public void testDeleteScheduleById() {
        // Create and save a schedule event
        ScheduleEvent scheduleEvent = new ScheduleEvent();
        scheduleEvent.setStartLocation("Miami");
        scheduleEvent.setEndLocation("Orlando");
        scheduleEvent.setUser(testUser);
        scheduleEventRepo.save(scheduleEvent);

        // Delete the schedule by ID
        int result = scheduleEventService.deleteScheduleById(testUser.getEmail(), scheduleEvent.getScheduleId());
        assertEquals(0, result);  // Success

        // Ensure the schedule was deleted
        List<ScheduleEvent> savedSchedules = scheduleEventRepo.findScheduleEventByUserID(testUser.getUserid());
        assertEquals(0, savedSchedules.size());
    }
}
