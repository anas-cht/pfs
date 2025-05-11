package com.example.pfs.dto;


import com.example.pfs.model.Userinfo;
import com.example.pfs.model.message;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class userdto {
    private Long id;
    private String username;
    private String fullname ;
    private String university;
    private String degree;
    private String email ;
    private String password ;
    private List<messagedto> messages;
    private userinfodto userinfo;

}
