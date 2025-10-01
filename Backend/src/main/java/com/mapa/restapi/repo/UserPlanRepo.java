package com.mapa.restapi.repo;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPlanRepo extends JpaRepository<UserPlan, Long> {


    Optional<UserPlan> findByUser(User user);

    Optional<UserPlan> findByPlanID(long planID);

    @Query(value = "SELECT * FROM user_plan t WHERE t.user_id = ?1", nativeQuery = true)
    Optional<UserPlan> findByUserID(long userID);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserPlan up WHERE up.user.userid = :userId")
    void deleteByUserId(@Param("userId") Long userId);

}
