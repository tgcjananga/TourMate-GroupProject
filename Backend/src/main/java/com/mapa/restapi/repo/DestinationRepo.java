package com.mapa.restapi.repo;

import com.mapa.restapi.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepo extends JpaRepository<Destination, Long> {

    Optional<Destination> findByDestinationName(String name);

    List<Destination> findByDestinationNameContaining(String destinationName);
}
