package com.example.pfs.mapper;

import com.example.pfs.dto.messagedto;
import com.example.pfs.model.message;

public class messagemapper {
    public static messagedto mapmessagetodto(message message){
        return new messagedto(
                message.getId(),
                message.getMessage(),
                message.getUser().getId()
        );
    }

//    public static message mapdtotomessage(messagedto message){
//        return new message(
//                message.getId(),
//                message.getMessage(),
//                message.getUser()
//        );
//    }
}
