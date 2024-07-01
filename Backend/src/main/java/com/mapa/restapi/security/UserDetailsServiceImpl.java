package com.mapa.restapi.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.UserRepo;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepo userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Ensure that user.getPassword() returns the hashed password stored in the database
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail()) // Using email as username
                .password(user.getPassword()) // Assuming user.getPassword() returns the hashed password
                .build();
    }
}
