package com.example.pfs.service;

import org.springframework.web.multipart.MultipartFile;

public interface PdfService {
    String uploadAndForward(MultipartFile file);
}
