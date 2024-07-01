package com.mapa.restapi.controller;


import com.mapa.restapi.model.User;
import com.mapa.restapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail())!=null){
            return ResponseEntity.badRequest().body("Email Already Registered");
        }

        String msg=userService.saveUser(user);

        return ResponseEntity.status(HttpStatus.OK).body(msg);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "Deleted";
    }


}
