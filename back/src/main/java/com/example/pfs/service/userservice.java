package com.example.pfs.service;

import com.example.pfs.dto.userdto;

import java.util.List;


public interface userservice {
    userdto adduser(userdto udto);
    userdto getuserbyid (Long userid);
    List<userdto> getallusers();
    userdto findByEmail (String email);
    userdto validateCredentials(String email, String password);
    userdto updatepass(String password,Long id);
    userdto updateuser (userdto userdto,Long id);
    userdto removeuser(userdto user);
}
