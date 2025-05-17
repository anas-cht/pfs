package com.example.pfs.service;

import com.example.pfs.dto.userinfodto;
import com.example.pfs.model.JobMatch;
import com.example.pfs.model.Userinfo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIJobRecommendationService {

    private final RestTemplate restTemplate = new RestTemplate();

    public userinfodto getRecommendations(Userinfo userinfo) {
        String url = "http://localhost:8000/recommend";

        Map<String, Object> payload = new HashMap<>();
        payload.put("skills", List.of(userinfo.getSkills().split(",")));
        payload.put("interests", List.of(userinfo.getInterests().split(",")));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> resBody = response.getBody();

            userinfodto dto = new userinfodto();
            dto.setSkills(userinfo.getSkills());
            dto.setInterests(userinfo.getInterests());

            Map<String, Object> career = (Map<String, Object>) resBody.get("career_recommendation");
            dto.setTopCareer((String) career.get("top"));
            dto.setCareerScores(new ObjectMapper().convertValue(
                    career.get("all"), new TypeReference<Map<String, Double>>() {}));

            List<JobMatch> jobs = new ObjectMapper()
                    .convertValue(resBody.get("job_matches"), new TypeReference<List<JobMatch>>() {});
            dto.setJobMatches(jobs);

            return dto;

        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to AI engine", e);
        }
    }
}
