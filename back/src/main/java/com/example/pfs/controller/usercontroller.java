package com.example.pfs.controller;


import com.example.pfs.dto.loginrequest;
import com.example.pfs.dto.userdto;
import com.example.pfs.exception.DuplicateFieldException;
import com.example.pfs.model.user;
import com.example.pfs.service.userservice;
import com.example.pfs.service.userserviceimpl;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import com.example.pfs.service.CustomOAuth2User;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class usercontroller {
    private userserviceimpl usr;

    @PostMapping
    public ResponseEntity<userdto> createUser(@RequestBody userdto userDto) {

        userdto savedUser = usr.adduser(userDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<userdto> getUserByID(@PathVariable("id") Long userid) {
        userdto u = usr.getuserbyid(userid);
        return ResponseEntity.ok(u);
    }

    @PostMapping("/home")
    public ResponseEntity<userdto> getUserByEmail(@RequestBody loginrequest request) {
        userdto u = usr.findByEmail(request.getEmail());
        return ResponseEntity.ok(u);
    }

    @GetMapping
    public ResponseEntity<List<userdto>> getallusers() {
        List<userdto> users = usr.getallusers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/login")
    public ResponseEntity<userdto> loginUser(@RequestBody loginrequest request) {
        // 1. Validate credentials
        userdto user = usr.validateCredentials(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/setpassword/{id}")
    public ResponseEntity<userdto> updatepass(@RequestBody userdto userDto,@PathVariable Long id) {
        userdto user = usr.updatepass(userDto.getPassword(),id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/updateuser/{id}")
    public ResponseEntity<userdto> updateUser(@PathVariable Long id, @RequestBody userdto userDto) {
        userdto updatedUser = usr.updateuser( userDto,id);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/removeuser")
    public ResponseEntity<userdto> removeUser( @RequestBody userdto userDto){
        userdto user=usr.removeuser(userDto);
        return ResponseEntity.ok(user);
    }
}
