package com.example.pfs.model;


import lombok.*;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class JobMatch {
    private String job_title;
    private String company;
    private String location;
    private String description;
    private List<String> skills;
}
