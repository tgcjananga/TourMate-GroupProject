package com.mapa.restapi.service;

import com.mapa.restapi.entity.User;
import com.mapa.restapi.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public void saveUser(User user) {
        userRepo.save(user);
    }

    public void deleteUser(long id) {
        userRepo.deleteById(id);
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }
}
