package com.mapa.restapi.repo;

import com.mapa.restapi.model.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StopRepo extends JpaRepository<Stop, Integer> {

}
