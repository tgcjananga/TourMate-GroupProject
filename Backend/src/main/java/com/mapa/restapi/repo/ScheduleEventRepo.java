package com.mapa.restapi.repo;

import com.mapa.restapi.dto.ScheduleEventDto;
import com.mapa.restapi.model.ScheduleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleEventRepo extends JpaRepository<ScheduleEvent,Long> {

    @Query(value = "SELECT * from schedule_event s where user_id=?1",nativeQuery = true)
    List<ScheduleEvent> findScheduleEventByUserID(long userid);

}

