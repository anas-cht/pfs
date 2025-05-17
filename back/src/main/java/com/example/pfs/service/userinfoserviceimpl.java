package com.example.pfs.service;

import com.example.pfs.dto.userinfodto;
import com.example.pfs.exception.resourcenotfoundexception;
import com.example.pfs.model.Userinfo;
import com.example.pfs.mapper.userinfomapper;
import com.example.pfs.model.User;
import com.example.pfs.repository.Userinforepository;
import com.example.pfs.repository.userrepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class userinfoserviceimpl implements userinfoservice {
    private final Userinforepository uir;
    private final userrepository ur;

    public userinfoserviceimpl(Userinforepository uir, userrepository ur) {
        this.uir = uir;
        this.ur = ur;
    }

    @Override
    @Transactional
    public userinfodto adduserinfo(userinfodto userinfoDto) {
        User user = ur.findById(userinfoDto.getUserid())
                .orElseThrow(() -> new resourcenotfoundexception("User not found"));

        // Check if user already has userinfo
        if (user.getUserinfo() != null) {
            throw new IllegalStateException("User already has userinfo");
        }

        Userinfo userinfo = new Userinfo();
        userinfo.setInterests(userinfoDto.getInterests());
        userinfo.setSkills(userinfoDto.getSkills());
        userinfo.setUser(user);  // This sets both sides of the relationship

        Userinfo savedUserinfo = uir.save(userinfo);
        return userinfomapper.mapuserinfotodto(savedUserinfo);
    }

    //    @Override
//    public userinfodto getUserinfoByUserId(Long userid) {
//        user user=ur.findById(userid)
//                .orElseThrow(()->new resourcenotfoundexception("user not found"));
//        userinfodto userinfodto=uir.findByUserId(userid);
//        userinfodto.setUser(user);
//        return userinfodto ;
//    }
    @Override
    @Transactional(readOnly = true)
    public userinfodto getUserinfoByUserId(Long userid) {
        Userinfo userinfo = uir.findByUserId(userid)
                .orElseThrow(() -> new resourcenotfoundexception("Userinfo not found"));

        return userinfomapper.mapuserinfotodto(userinfo);
    }


}
