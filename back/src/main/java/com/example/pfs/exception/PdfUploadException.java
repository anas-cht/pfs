package com.example.pfs.exception;

public class PdfUploadException extends RuntimeException {
    public PdfUploadException(String message) {
        super(message);
    }

    public PdfUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
