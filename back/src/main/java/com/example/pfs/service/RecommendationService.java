package com.example.pfs.service;

import com.example.pfs.dto.HybridRequest;
import com.example.pfs.dto.userinfodto;
import com.example.pfs.model.RecommendationResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_URL = "http://model3:8002/recommendations/hybrid";

    public RecommendationResponse[] getHybridRecommendations(userinfodto dto) {
        // Build FastAPI-compatible request object
        HybridRequest fastapiReq = new HybridRequest(dto.getUserid(), dto.getN_recommendations());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<HybridRequest> entity = new HttpEntity<>(fastapiReq, headers);

        ResponseEntity<RecommendationResponse[]> response = restTemplate
                .postForEntity(FASTAPI_URL, entity, RecommendationResponse[].class);

        return response.getBody();
    }
}

