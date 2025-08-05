package com.example.Controller;

import com.example.Entity.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;


    @GetMapping("/get-all-users")
    public ResponseEntity<?> getAllUsers(){

        List<User> allUsers = userService.getAll();

        if(allUsers != null && !allUsers.isEmpty())
            return new ResponseEntity<>(allUsers, HttpStatus.OK);

        return new ResponseEntity<>("No User Found", HttpStatus.NO_CONTENT);
    }

    @PostMapping("/create-new-admin")
    public void addNewAdmin(@RequestBody User user){
        userService.saveAdmin(user);
    }

}
