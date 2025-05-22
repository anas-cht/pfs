package com.example.pfs.model;


import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationResponse {
    private String title;
    private String provider;
    private String skills;
    private double rating;
    private String course_link;

    // getters & setters
}
