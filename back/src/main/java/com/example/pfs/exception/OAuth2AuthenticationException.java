package com.example.pfs.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.NOT_FOUND)
public class OAuth2AuthenticationException extends RuntimeException{
    public OAuth2AuthenticationException(String message){
        super(message);
    }
}
