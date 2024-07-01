package com.mapa.restapi.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.mapa.restapi.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email); // Update method name to findByEmail
    Optional<User> getByIdentifier(String identifier);

    @Transactional
    @Modifying
    @Query("update User user set user.password=?2 where user.email=?1")
    void updatePassword(String email,String password);
}
