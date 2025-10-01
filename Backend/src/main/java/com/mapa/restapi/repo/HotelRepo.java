package com.mapa.restapi.repo;

import com.mapa.restapi.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepo extends JpaRepository<Hotel, Long> {

    Hotel findByNameAndLocation(String name, String location);
}
