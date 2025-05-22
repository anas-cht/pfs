package com.example.pfs.dto;


import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UploadResponseDto {
    private String status;
    private String filename;

}
