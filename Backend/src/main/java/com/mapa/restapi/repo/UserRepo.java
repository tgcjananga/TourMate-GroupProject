package com.mapa.restapi.repo;

import com.mapa.restapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {

   User getByEmail(String email);

}
