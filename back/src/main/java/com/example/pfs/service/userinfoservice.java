package com.example.pfs.service;

import com.example.pfs.dto.userinfodto;

import java.util.Optional;

public interface userinfoservice {

   userinfodto adduserinfo(userinfodto userinfo) ;
   userinfodto getUserinfoByUserId(Long userid);
}
