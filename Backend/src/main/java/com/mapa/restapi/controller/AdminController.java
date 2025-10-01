package com.mapa.restapi.controller;

import com.mapa.restapi.model.User;
import com.mapa.restapi.service.BookmarkPlaceService;
import com.mapa.restapi.service.UserPlanService;
import com.mapa.restapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*")  //allow for all the ports
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookmarkPlaceService bookmarkPlaceService;

    @Autowired
    private UserPlanService userPlanService;

    @GetMapping("/getUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getUsers() {

        return userService.getAllUsers();
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "Deleted";
    }
}
