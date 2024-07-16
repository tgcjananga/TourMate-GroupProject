package com.mapa.restapi.service;

import com.mapa.restapi.dto.UserDto;
import com.mapa.restapi.model.User;
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

    public UserDto saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        if(userRepo.findByEmail(user.getEmail()).isPresent()) {
            return convertUserDto(user);
        }
        return null;

    }

    public void deleteUser(long id) {
        userRepo.deleteById(id);
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }

    public User findUserByUserIdentifier(String identifier) {
        return  userRepo.getByIdentifier(identifier).orElse(null);
    }

    public  UserDto convertUserDto(User user){
        return UserDto.builder()
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .age(user.getAge())
                .gender(user.getGender())
                .usertype(user.getUsertype())
        .build();
    }
}
