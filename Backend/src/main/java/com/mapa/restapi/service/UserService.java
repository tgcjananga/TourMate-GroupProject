package com.mapa.restapi.service;

import com.mapa.restapi.model.Credentials;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    public List<User> getAllUsers() {

        return userRepo.findAll();
    }

    public void saveUser(User user) {
        userRepo.save(user);
    }

    public void deleteUser(long id) {
        userRepo.deleteById(id);
    }


    public boolean loginUser(Credentials credentials) {
        User user=userRepo.getByEmail(credentials.getEmail());
        if (user.getPassword().equals(credentials.getPassword())){
            return true;
        }

        return false;
    }
}
