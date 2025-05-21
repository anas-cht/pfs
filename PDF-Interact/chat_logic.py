# chat_logic.py

import fitz  # PyMuPDF
from concurrent.futures import ThreadPoolExecutor
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import os

# Constants
PDF_STORAGE_PATH = "store/"
os.makedirs(PDF_STORAGE_PATH, exist_ok=True)

PROMPT_TEMPLATE = """
You are an expert research assistant. Use only the provided context to answer the query.
You must continue the conversation based on previous questions and answers.
Do not add any external information. If the context is insufficient, say so.

Previous Conversation:
{chat_history}

Current Query: {user_query}
Context: {document_context}
Answer:
"""

# Embedding & LLM
EMBEDDING_MODEL = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
LANGUAGE_MODEL = OllamaLLM(model="mistral:latest")

DOCUMENT_VECTOR_DB = None


def process_pdf(file_path: str):
    """Load and embed PDF into FAISS vector DB."""
    doc = fitz.open(file_path)
    with ThreadPoolExecutor() as executor:
        pages = list(executor.map(lambda page: page.get_text(), doc))
    text = "\n".join(pages)
    documents = [Document(page_content=text)]

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=100,
        add_start_index=True,
    )
    chunks = splitter.split_documents(documents)

    global DOCUMENT_VECTOR_DB
    DOCUMENT_VECTOR_DB = FAISS.from_documents(chunks, EMBEDDING_MODEL)


def find_related_documents(query: str, chat_history: list):
    """Retrieve relevant document chunks using vector similarity."""
    context = "\n".join([f"{m['role']}: {m['content']}" for m in chat_history[-3:]])
    full_query = f"{context}\nUser: {query}"

    if DOCUMENT_VECTOR_DB is None:
        raise ValueError("Vector DB is empty. Upload a document first.")

    return DOCUMENT_VECTOR_DB.similarity_search(full_query, k=5)


def generate_response(user_query: str, chat_history: list) -> str:
    """Generate a response from the language model."""
    related_docs = find_related_documents(user_query, chat_history)
    context_text = "\n\n".join([doc.page_content for doc in related_docs])
    history_text = "\n".join(
        [f"{m['role']}: {m['content']}" for m in chat_history[-3:]]
    )

    prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    chain = prompt | LANGUAGE_MODEL

    return chain.invoke(
        {
            "user_query": user_query,
            "document_context": context_text,
            "chat_history": history_text,
        }
    )
