package com.example.pfs.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_FOUND)
public class resourcenotfoundexception extends RuntimeException{

    public resourcenotfoundexception(String message){
        super(message);
    }
}
