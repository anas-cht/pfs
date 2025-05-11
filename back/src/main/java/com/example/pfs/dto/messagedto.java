package com.example.pfs.dto;


import lombok.*;
import com.example.pfs.model.user;


@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class messagedto {
    private Long id;
    private String message;
    private Long userid ;
}
