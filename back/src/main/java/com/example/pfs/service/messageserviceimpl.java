package com.example.pfs.service;

import com.example.pfs.dto.messagedto;
import com.example.pfs.exception.resourcenotfoundexception;
import com.example.pfs.mapper.messagemapper;
import com.example.pfs.model.message;
import com.example.pfs.model.user;
import com.example.pfs.repository.messagerepository;
import com.example.pfs.repository.userrepository;
import lombok.Data;
import org.springframework.stereotype.Service;


@Data
@Service
public class messageserviceimpl implements messageservice{

    private final messagerepository ur ;
    private final userrepository userRepository;

    public messageserviceimpl(messagerepository ur,userrepository userRepository) {
        this.ur = ur;
        this.userRepository=userRepository;
    }

    @Override
    public messagedto addmessage(messagedto messagedto) {
        user user = userRepository.findById(messagedto.getUserid())
                .orElseThrow(() -> new resourcenotfoundexception("User not found"));
        message message = new message();
        message.setMessage(messagedto.getMessage());
        message.setUser(user);
        message savedmessage= ur.save(message);
        return messagemapper.mapmessagetodto(savedmessage);
    }
}
