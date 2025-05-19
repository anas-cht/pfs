# 📘 DocuMind AI – Intelligent PDF Assistant

DocuMind AI is a Retrieval-Augmented Generation (RAG) application built with **Streamlit**, **LangChain**, and **Ollama** to help users interact with large PDF documents in a conversational format.

---

## 🚀 Features

- 📄 Upload and parse large PDF documents
- 🧠 Split content into meaningful chunks using LangChain
- 🧷 Semantic search using FAISS and Sentence Transformers
- 🧾 Contextual Q&A with memory of previous interactions
- 🤖 Powered by local LLMs via Ollama (e.g., Mistral)

---

## 🛠️ Tech Stack

- **Frontend**: Streamlit
- **PDF Parsing**: PyMuPDF (`fitz`)
- **Chunking**: LangChain `RecursiveCharacterTextSplitter`
- **Vector DB**: FAISS
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2`
- **LLM**: Ollama with `mistral:latest`

---

## 📦 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/documind-ai.git
   cd documind-ai

   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt

   ```

3. **Run the app**
   ```bash
   streamlit run app.py
   ```

## 🧪 Example Usage

1. Upload or point to a PDF file (e.g., book.pdf)

2. Ask a question like:

"What are the common side effects of this medication?"

3. The AI will search for the answer based only on the document content and previous conversation.

## ⚠️ Notes

Ensure PyMuPDF is installed not the fitz package.

Ollama must be running locally with the mistral model:
```bash
ollama run mistral
```