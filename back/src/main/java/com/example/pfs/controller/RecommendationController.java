package com.example.pfs.controller;

import com.example.pfs.dto.userinfodto;
import com.example.pfs.model.RecommendationResponse;
import com.example.pfs.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/hybrid")
    public RecommendationResponse[] getHybrid(@RequestBody userinfodto dto) {
        return recommendationService.getHybridRecommendations(dto);
    }
}

