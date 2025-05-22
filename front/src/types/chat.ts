// src/types/chat.ts

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatRequest = {
  question: string;
  history: Message[];
};

export type ChatResponse = {
  answer: string;
};
