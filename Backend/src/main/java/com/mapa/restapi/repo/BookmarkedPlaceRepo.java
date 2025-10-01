package com.mapa.restapi.repo;

import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkedPlaceRepo extends JpaRepository<BookmarkedPlace, Long> {


    Optional<List<BookmarkedPlace>> findByUser(User user);

    @Query(value = "SELECT * FROM bookmarked_place t WHERE t.user_id = :userId", nativeQuery = true)
    Optional<List<BookmarkedPlace>> findByUserID(@Param("userId") Long userId);

    @Modifying
    @Query(value = "DELETE FROM bookmarked_place t WHERE t.attraction_id = :attractionId  ",nativeQuery = true)
    void deleteByAttractionID(@Param("attractionId") Long attractionId);
}
