package com.mapa.restapi.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mapa.restapi.model.ForgotPassword;
import com.mapa.restapi.model.User;

@Repository
public interface ForgetPasswordRepo extends JpaRepository<ForgotPassword, Long> {

    @Query("select forgotPassword from ForgotPassword forgotPassword where forgotPassword.otp = ?1 and forgotPassword.user = ?2")
    Optional<ForgotPassword> findByOtpAndUser(int otp, User user);
}
