// components/DocuMindChat.tsx
import React, { useState } from "react";
import { uploadPdf, chatWithPdf } from "../services/documindservice";
import { Message } from "../types/chat";

const DocuMindChat: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await uploadPdf(file);
      alert("✅ PDF uploaded and processed successfully.");
    } catch (err) {
      alert("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!question.trim()) return;
    const newChat: Message[] = [...chat, { role: "user", content: question }];
    setChat(newChat);
    setQuestion("");
    setLoading(true);
    try {
      const response = await chatWithPdf(question, newChat);
      setChat([...newChat, { role: "assistant", content: response } as Message]);
    } catch (err) {
      alert("❌ Chat failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">DocuMind PDF Chat</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button onClick={handleUpload} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload PDF
      </button>

      <div className="mt-6 space-y-4">
        {chat.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.role === "user" ? "bg-gray-200" : "bg-green-100"}`}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Ask about the document..."
        />
        <button onClick={handleChat} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default DocuMindChat;
