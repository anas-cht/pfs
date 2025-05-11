package com.example.pfs.mapper;

import com.example.pfs.dto.userinfodto;
import com.example.pfs.model.Userinfo;

public class userinfomapper {

    public static userinfodto mapuserinfotodto(Userinfo userinfo){
        return new userinfodto(userinfo.getId(),
                userinfo.getInterests(),
                userinfo.getSkills(),
                userinfo.getUser().getId()
        );
    }

//    public static Userinfo  mapdtotouserinfo(userinfodto userinfo){
//        return new Userinfo(userinfo.getId(),
//                userinfo.getInterests(),
//                userinfo.getSkills(),
//                userinfo.getUser()
//        );
//    }

}
