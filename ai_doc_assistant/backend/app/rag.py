# backend/app/rag.py
import os
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
    CSVLoader
)

class NaijaRAGSystem:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        self.vector_store = None
        self.qa_chain = None
        
    def process_document(self, file_path: str, file_type: str) -> List[str]:
        """Process document and extract chunks"""
        
        # Load document based on type
        if file_type == 'application/pdf':
            loader = PyPDFLoader(file_path)
        elif file_type == 'text/plain':
            loader = TextLoader(file_path)
        elif file_type in ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                          'application/msword']:
            loader = Docx2txtLoader(file_path)
        elif file_type == 'text/csv':
            loader = CSVLoader(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        documents = loader.load()
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        chunks = text_splitter.split_documents(documents)
        return chunks
    
    def create_vector_store(self, chunks, persist_directory: str = "./chroma_db"):
        """Create and persist vector store"""
        self.vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=persist_directory
        )
        self.vector_store.persist()
        
        # Create QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=OpenAI(temperature=0.1),
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=True
        )
    
    def query(self, question: str) -> Dict:
        """Query the RAG system"""
        if not self.qa_chain:
            raise ValueError("Vector store not initialized. Please process documents first.")
        
        result = self.qa_chain({"query": question})
        
        return {
            "answer": result["result"],
            "sources": [doc.metadata.get("source", "Unknown") for doc in result["source_documents"]]
        }