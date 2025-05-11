package com.example.pfs.dto;

import lombok.*;

import com.example.pfs.model.user ;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class userinfodto {
    private Long id;
    private String interests;
    private String skills;
    private Long userid;
}