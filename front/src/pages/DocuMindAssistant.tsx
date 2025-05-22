// pages/DocuMindAssistant.tsx
import React from "react";
import DocuMindChat from "../components/DocuMindChat";

const DocuMindAssistant: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to DocuMind Assistant</h1>
      <p className="mb-4">Upload a PDF and start chatting with it!</p>
      <DocuMindChat />
    </div>
  );
};

export default DocuMindAssistant;
