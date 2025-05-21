package com.example.pfs.controller;

import com.example.pfs.dto.Coursedto;
import com.example.pfs.service.Courseserviceimpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("api/course")
@CrossOrigin(origins = "http://localhost:5173")
public class Coursecontroller {

    private Courseserviceimpl csrvi;

    @PostMapping("/addcourse")
    public ResponseEntity<Coursedto> addcourse(@RequestBody Coursedto coursedto){

        Coursedto savedcourse= csrvi.addcourse(coursedto);
        return ResponseEntity.ok(savedcourse);
    }


    @GetMapping("/allcourses/{userid}")
    public ResponseEntity<List<Coursedto>> getallcourses(@PathVariable Long userid){
        List<Coursedto> courses=csrvi.getallcourse(userid);
        return new ResponseEntity<>(courses,HttpStatus.OK);
    }

}
