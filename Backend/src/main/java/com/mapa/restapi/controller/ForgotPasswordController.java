package com.mapa.restapi.controller;

import org.springframework.web.bind.annotation.RestController;

import com.mapa.restapi.dto.ChangePasswordDto;
import com.mapa.restapi.dto.MailBody;
import com.mapa.restapi.model.ForgotPassword;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.ForgetPasswordRepo;
import com.mapa.restapi.repo.UserRepo;
import com.mapa.restapi.service.EmailSenderService;
import java.sql.Date;
import java.time.Instant;
import java.util.Objects;
import java.util.Random;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/forgotPassword")
public class ForgotPasswordController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailSenderService senderService;

    @Autowired
    private ForgetPasswordRepo forgetPasswordRepo;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return new ResponseEntity<>("Invalid email format", HttpStatus.BAD_REQUEST);
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email"));

        int otp = otpGenerator();
        System.out.println("------------------------------------------------------------------------");
        System.out.println("Your otp is : "+otp);
        System.out.println("------------------------------------------------------------------------");
        MailBody mailBody = new MailBody(email,"This is the OTP for your forgot password request: " +otp,"OTP for Forget Password Request");

        ForgotPassword forgotPassword = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 70 * 1000))
                .user(user)
                .build();

        senderService.sendSimpleMessage(mailBody);

        forgetPasswordRepo.save(forgotPassword);
        

        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<String> verifyOtp(@PathVariable int otp, @PathVariable String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email"));
    
        ForgotPassword forgotPassword = forgetPasswordRepo.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP for email: " + email));
    
        if (forgotPassword.getExpirationTime().before(Date.from(Instant.now()))) {
            forgetPasswordRepo.deleteById(forgotPassword.getFpId());
            
            return new ResponseEntity<>("OTP has expired", HttpStatus.EXPECTATION_FAILED);
        }
        System.out.println("OTP " + otp + " for email " + email + " verified successfully");
        // OTP is valid, you can proceed with further actions like resetting the password
        return ResponseEntity.ok("OTP verified successfully");
    }
    
    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePasswordDto changePassword, @PathVariable String email) {
        if (!Objects.equals(changePassword.getPassword(), changePassword.getRepeatPassword())) {
            return new ResponseEntity<>("Passwords do not match", HttpStatus.EXPECTATION_FAILED);
        }

        String encodedPassword = passwordEncoder.encode(changePassword.getPassword());
        userRepo.updatePassword(email, encodedPassword);

        return ResponseEntity.ok("Password changed successfully");
    }

    private int otpGenerator() {
        Random random = new Random();
        return random.nextInt(900000) + 100000;
    }
}
