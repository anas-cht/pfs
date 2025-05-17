package com.example.pfs.dto;


import lombok.*;


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
