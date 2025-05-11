package com.example.pfs.controller;


import com.example.pfs.dto.messagedto;
import com.example.pfs.dto.userdto;
import com.example.pfs.service.messageserviceimpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class msgcontroller {

    private messageserviceimpl msv ;

    @PostMapping
    public ResponseEntity<messagedto> addmessage (@RequestBody messagedto messagedto){
        messagedto savedmessage=msv.addmessage(messagedto);
        return new ResponseEntity<>(savedmessage, HttpStatus.CREATED);

    }
}
