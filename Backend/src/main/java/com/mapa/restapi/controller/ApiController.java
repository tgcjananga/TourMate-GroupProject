package com.mapa.restapi.controller;


import com.mapa.restapi.model.Credentials;
import com.mapa.restapi.model.User;
import com.mapa.restapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
public class ApiController {

    @Autowired
    private UserService userService;


    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }


    @PostMapping("/signup")
    public User saveUser(@RequestBody User user) {
        userService.saveUser(user);
        System.out.println("Saved Successfully");
        return user;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Credentials credentials) {

        if (userService.loginUser(credentials)) {
            return new ResponseEntity<>("Login Successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Login Failed",HttpStatus.UNAUTHORIZED);
    }
    @DeleteMapping("delete/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "Deleted";
    }


}
