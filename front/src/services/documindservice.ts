// src/services/documindservice.ts
import axios from "axios";
import { Message, ChatRequest } from "../types/chat";

const BASE_URL = "http://localhost:8080/api";

// Function for uploading a PDF file
export const uploadPdf = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(`${BASE_URL}/pdf/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.message; // Assuming the backend returns a message like "File uploaded successfully."
  } catch (error) {
    throw error;
  }
};

// Function for chatting with the PDF document
export const chatWithPdf = async (
  question: string,
  history: Message[]
): Promise<string> => {
  const chatRequest: ChatRequest = { question, history };

  try {
    const response = await axios.post(`${BASE_URL}/chat`, chatRequest);
    return response.data.answer; // Assuming the backend returns an "answer" field with the response.
  } catch (error) {
    throw error;
  }
};
