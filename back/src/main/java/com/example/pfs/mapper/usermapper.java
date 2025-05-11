package com.example.pfs.mapper;

import com.example.pfs.dto.userdto;
import com.example.pfs.model.user;

import java.util.Optional;

public class usermapper {

    public static user mapToUser(userdto userDto) {
        user user = new user();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setFullname(userDto.getFullname());
        user.setUniversity(userDto.getUniversity());
        user.setDegree(userDto.getDegree());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        return user;
    }

    public static userdto mapToDto(user user) {
        userdto userdto = new userdto();
        userdto.setId(user.getId());
        userdto.setUsername(user.getUsername());
        userdto.setFullname(user.getFullname());
        userdto.setUniversity(user.getUniversity());
        userdto.setDegree(user.getDegree());
        userdto.setEmail(user.getEmail());
        userdto.setPassword(user.getPassword());
        return userdto;
    }
    }

