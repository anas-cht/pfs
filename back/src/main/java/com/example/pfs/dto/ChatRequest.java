package com.example.pfs.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatRequest {
    private String question;
    private List<Message> history; // Add the history field to store the chat history

    // Message class to represent each individual message in the history
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class Message {
        private String role;  // role of the message, e.g., "user" or "assistant"
        private String content;  // content of the message
    }
}
