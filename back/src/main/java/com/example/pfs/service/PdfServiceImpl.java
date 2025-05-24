package com.example.pfs.service;

import com.example.pfs.exception.PdfUploadException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

@Service
public class PdfServiceImpl implements PdfService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String uploadAndForward(MultipartFile file) {
        try {
            String cleanFilename = Objects.requireNonNull(file.getOriginalFilename()).replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            Path temp = Files.createTempFile("doc_", "_" + cleanFilename);
            file.transferTo(temp.toFile());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(temp));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String aiUrl = "http://model2:8001/upload";
            System.out.println("Forwarding PDF to: {}" + aiUrl);
            ResponseEntity<String> aiResponse = restTemplate.postForEntity(aiUrl, requestEntity, String.class);

            return aiResponse.getBody();
        } catch (IOException e) {
            throw new PdfUploadException("Failed to upload and forward PDF to AI backend", e);
        }
    }
}

