package com.example.pfs.controller;

import com.example.pfs.dto.userdto;
import com.example.pfs.dto.userinfodto;
import com.example.pfs.service.userinfoserviceimpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/usersinfo")
@CrossOrigin(origins = "http://localhost:5173")
public class userinfocontroller {

    private userinfoserviceimpl uisv;
    @PostMapping("/adduserinfo")
    public ResponseEntity<userinfodto> createUser(@RequestBody userinfodto userinfodto) {
        userinfodto savedUserinfo = uisv.adduserinfo(userinfodto);
        return new ResponseEntity<>(savedUserinfo, HttpStatus.CREATED);
    }

    @GetMapping("/getuserinfo/{userid}")
    public ResponseEntity<userinfodto> getUserinfoByUserId(@PathVariable Long userid) {
        userinfodto userinfodto= uisv.getUserinfoByUserId(userid);
        return ResponseEntity.ok(userinfodto);
    }
}
