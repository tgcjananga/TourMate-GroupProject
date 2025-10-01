package com.mapa.restapi.repo;

import com.mapa.restapi.dto.ScheduleEventDto;
import com.mapa.restapi.model.ScheduleEvent;
import com.mapa.restapi.model.User;
import lombok.Builder;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ScheduleEventRepoTest {


    private static ScheduleEventRepo scheduleEventRepo;
    private static User user;
    private static ScheduleEvent scheduleEvent;

    @BeforeAll
    static void setUpBeforeClass(@Autowired UserRepo userRepo1,@Autowired ScheduleEventRepo scheduleEventRepo1) throws Exception {
        scheduleEventRepo = scheduleEventRepo1;
        user = userRepo1.findByEmail("test@test.com").orElseThrow();
        scheduleEvent = ScheduleEvent.builder().user(user).startLocation("Kandy").endLocation("Colombo").build();
        scheduleEventRepo.save(scheduleEvent);
    }

    @AfterAll
    static void tearDownAfterClass()  {
        scheduleEventRepo.deleteById(scheduleEvent.getScheduleId());
    }



    @Test
    void findScheduleEventByUserID() {
        List<ScheduleEvent> events = scheduleEventRepo.findScheduleEventByUserID(user.getUserid());
        assertEquals(scheduleEvent.getScheduleId(), events.get(0).getScheduleId());
    }
}