package com.example.pfs.controller;

import com.example.pfs.repository.Userinforepository;
import com.example.pfs.exception.resourcenotfoundexception;
import com.example.pfs.dto.userinfodto;
import com.example.pfs.model.Userinfo;
import com.example.pfs.service.AIJobRecommendationService;
import com.example.pfs.service.userinfoserviceimpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/usersinfo")
@CrossOrigin(origins = "http://localhost:5173")
public class userinfocontroller {

    private userinfoserviceimpl uisv;
    private final Userinforepository userinforepository;
    private final AIJobRecommendationService aiService;

    public userinfocontroller(Userinforepository userinforepository, AIJobRecommendationService aiService, userinfoserviceimpl uisv) {
        this.userinforepository = userinforepository;
        this.aiService = aiService;
        this.uisv = uisv;
    }

    @PostMapping("/adduserinfo")
    public ResponseEntity<userinfodto> createUser(@RequestBody userinfodto userinfodto) {
        userinfodto savedUserinfo = uisv.adduserinfo(userinfodto);
        return new ResponseEntity<>(savedUserinfo, HttpStatus.CREATED);
    }

    @GetMapping("/getuserinfo/{userid}")
    public ResponseEntity<userinfodto> getUserinfoByUserId(@PathVariable Long userid) {
        userinfodto userinfodto = uisv.getUserinfoByUserId(userid);
//        System.out.println(userinfodto.getSkills());
        return ResponseEntity.ok(userinfodto);
    }

    @GetMapping("/recommend/{userId}")
    public ResponseEntity<userinfodto> recommendCareer(@PathVariable Long userId) {
        Userinfo userinfo = userinforepository.findByUserId(userId)
                .orElseThrow(() -> new resourcenotfoundexception("User not found"));
//        System.out.println("controller used");
        userinfodto result = aiService.getRecommendations(userinfo);
        return ResponseEntity.ok(result);
    }

}
