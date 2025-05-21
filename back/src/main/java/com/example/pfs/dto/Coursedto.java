package com.example.pfs.dto;


import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Coursedto {

    private Long id ;
    private String title ;
    private String editeur ;
    private Double rating ;
    private Long userid ;
}
