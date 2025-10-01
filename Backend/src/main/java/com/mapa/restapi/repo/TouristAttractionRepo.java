package com.mapa.restapi.repo;

import com.mapa.restapi.model.TouristAttraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TouristAttractionRepo extends JpaRepository<TouristAttraction, Long> {

    @Query( value = "select * from tourist_attraction", nativeQuery = true)
    List<TouristAttraction> findTouristAttraction();

    Optional<TouristAttraction> findByName(String name);

    @Query(value = "SELECT * FROM tourist_attraction WHERE city = ?1 AND (type LIKE %?2% )", nativeQuery = true)
    List<TouristAttraction> findByCityAndPreferences(String city, String pref1); // add more as needed

}
