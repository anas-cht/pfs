package com.example.pfs.dto;

import com.example.pfs.model.JobMatch;
import lombok.*;
import java.util.*;


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

    private String topCareer;
    private Map<String, Double> careerScores;
    private List<JobMatch> jobMatches;

    private int n_recommendations;

    public userinfodto(Long id, String interests, String skills, Long userid) {
        this.id = id;
        this.interests = interests;
        this.skills = skills;
        this.userid = userid;
    }
}
