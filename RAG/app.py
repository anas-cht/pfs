import sys


# Prevent Streamlit from inspecting torch internals
class DummyTorch:
    __path__ = []  # fake __path__ to avoid streamlit watcher errors


sys.modules["torch.classes"] = DummyTorch()


import streamlit as st
import fitz  # PyMuPDF
import asyncio
from concurrent.futures import ThreadPoolExecutor
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.documents import Document
import sys


# Constants
path = "data/Medical_book.pdf"
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
PDF_STORAGE_PATH = "store/"
EMBEDDING_MODEL = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
LANGUAGE_MODEL = OllamaLLM(model="mistral:latest")  # More accurate

DOCUMENT_VECTOR_DB = None

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []  # Stores all user-assistant exchanges


def save_uploaded_file(uploaded_file):
    file_path = PDF_STORAGE_PATH + uploaded_file.name
    with open(file_path, "wb") as file:
        file.write(uploaded_file.getbuffer())
    return file_path


def load_pdf_documents(file_path):
    doc = fitz.open(file_path)
    with ThreadPoolExecutor() as executor:
        pages = list(executor.map(lambda page: page.get_text(), doc))
    return [Document(page_content="\n".join(pages))]


def chunk_documents(raw_documents):
    text_processor = RecursiveCharacterTextSplitter(
        chunk_size=512,  # Increased chunk size for better context
        chunk_overlap=100,  # More overlap to maintain continuity
        add_start_index=True,
    )
    return text_processor.split_documents(raw_documents)


async def process_and_index_documents(file_path):
    raw_docs = load_pdf_documents(file_path)
    processed_chunks = chunk_documents(raw_docs)
    global DOCUMENT_VECTOR_DB
    DOCUMENT_VECTOR_DB = FAISS.from_documents(processed_chunks, EMBEDDING_MODEL)


def find_related_documents(query, chat_history):
    """Retrieve relevant chunks and use chat history for context."""
    conversation_context = "\n".join(
        [f"{m['role']}: {m['content']}" for m in chat_history[-3:]]
    )  # Last 3 exchanges
    full_query = f"{conversation_context}\nUser: {query}"

    results = DOCUMENT_VECTOR_DB.similarity_search(full_query, k=5)
    return results  # Top 5 most relevant chunks


def generate_answer(user_query, context_documents, chat_history):
    """Generate an answer considering previous conversations."""
    context_text = "\n\n".join([doc.page_content for doc in context_documents])

    conversation_history = "\n".join(
        [f"{m['role']}: {m['content']}" for m in chat_history[-3:]]
    )  # Keep recent history

    conversation_prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    response_chain = conversation_prompt | LANGUAGE_MODEL

    return response_chain.invoke(
        {
            "user_query": user_query,
            "document_context": context_text,
            "chat_history": conversation_history,
        }
    )


async def async_generate_answer(user_query):
    loop = asyncio.get_event_loop()
    related_docs = await loop.run_in_executor(
        None, find_related_documents, user_query, st.session_state.chat_history
    )
    response = await loop.run_in_executor(
        None, generate_answer, user_query, related_docs, st.session_state.chat_history
    )
    return response


st.title("📘 DocuMind AI")
st.markdown("### Your Intelligent Document Assistant")
st.markdown("---")

asyncio.run(process_and_index_documents(path))


user_input = st.chat_input("Enter your question...")

if user_input:
    st.session_state.chat_history.append({"role": "user", "content": user_input})
    with st.spinner("Searching the document..."):
        ai_response = asyncio.run(async_generate_answer(user_input))
    st.session_state.chat_history.append({"role": "assistant", "content": ai_response})

for message in st.session_state.chat_history:
    with st.chat_message(
        message["role"], avatar="🤖" if message["role"] == "assistant" else None
    ):
        st.write(message["content"])
