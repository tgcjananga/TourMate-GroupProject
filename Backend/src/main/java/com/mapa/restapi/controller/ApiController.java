package com.mapa.restapi.controller;



import com.mapa.restapi.entity.User;
import com.mapa.restapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@CrossOrigin(origins="*")  //allow for all the ports
public class ApiController {

    @Autowired
    private UserService userService;


    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }


    @PostMapping("/signup")
    public User createUser(@RequestBody User user) {
        System.out.println("Saved Successfully");
        return userService.createUser(user);
        
    }

    
    @DeleteMapping("delete/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "Deleted";
    }


}
