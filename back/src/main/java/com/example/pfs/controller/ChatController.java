package com.example.pfs.controller;

import com.example.pfs.dto.ChatRequest;
import com.example.pfs.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:8001")
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.api.url}")
    private String aiApiUrl; // e.g., http://localhost:8001/chat

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest chatRequest) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<ChatRequest> requestEntity = new HttpEntity<>(chatRequest, headers);

        ResponseEntity<ChatResponse> response = restTemplate.postForEntity(
                aiApiUrl, requestEntity, ChatResponse.class
        );

        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/test-fastapi")
    public ResponseEntity<String> testConnection() {
        try {
            String result = restTemplate.getForObject(aiApiUrl.replace("/chat", "/"), String.class);
            return ResponseEntity.ok("✅ Connected to FastAPI: " + result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Failed to connect to FastAPI: " + e.getMessage());
        }
    }

}
