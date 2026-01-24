# backend/app/vector_store.py
import os
import shutil
from typing import List, Dict, Any
from chromadb import PersistentClient, Settings
from chromadb.utils import embedding_functions
import numpy as np
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class MySQLVectorStore:
    """Vector store using ChromaDB with persistent storage"""
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        
        # Create directory if it doesn't exist
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True,
            )
        )
        
        # Initialize embedding function
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Collection names will be based on user_id
        self.collections = {}
    
    def get_or_create_collection(self, user_id: int, document_id: int = None):
        """Get or create a collection for a user/document"""
        if document_id:
            collection_name = f"user_{user_id}_doc_{document_id}"
        else:
            collection_name = f"user_{user_id}_general"
        
        if collection_name not in self.collections:
            self.collections[collection_name] = self.client.get_or_create_collection(
                name=collection_name,
                embedding_function=self.embedding_function,
                metadata={"user_id": str(user_id), "document_id": str(document_id) if document_id else "general"}
            )
        
        return self.collections[collection_name]
    
    def add_documents(self, user_id: int, documents: List[Dict[str, Any]], document_id: int = None):
        """Add documents to vector store"""
        if not documents:
            return []
        
        collection = self.get_or_create_collection(user_id, document_id)
        
        # Prepare documents for storage
        ids = []
        metadatas = []
        contents = []
        
        for idx, doc in enumerate(documents):
            doc_id = f"doc_{document_id or 'general'}_{idx}_{int(datetime.now().timestamp())}"
            ids.append(doc_id)
            contents.append(doc["content"])
            
            metadata = doc.get("metadata", {}).copy()
            metadata.update({
                "user_id": str(user_id),
                "document_id": str(document_id) if document_id else "general",
                "source": doc.get("source", "unknown"),
                "page": str(doc.get("page", 0)),
                "timestamp": datetime.now().isoformat()
            })
            metadatas.append(metadata)
        
        # Add to collection
        collection.add(
            documents=contents,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Added {len(documents)} documents to collection for user {user_id}")
        return ids
    
    def search(self, user_id: int, query: str, n_results: int = 5, document_id: int = None):
        """Search for similar documents"""
        collection = self.get_or_create_collection(user_id, document_id)
        
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )
        
        # Format results
        formatted_results = []
        if results["documents"]:
            for i, doc in enumerate(results["documents"][0]):
                formatted_results.append({
                    "content": doc,
                    "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                    "distance": results["distances"][0][i] if results["distances"] else None,
                    "score": 1 - (results["distances"][0][i] if results["distances"] else 0)  # Convert distance to similarity score
                })
        
        return formatted_results
    
    def delete_documents(self, user_id: int, document_id: int = None):
        """Delete documents from vector store"""
        if document_id:
            collection_name = f"user_{user_id}_doc_{document_id}"
        else:
            collection_name = f"user_{user_id}_general"
        
        try:
            self.client.delete_collection(name=collection_name)
            if collection_name in self.collections:
                del self.collections[collection_name]
            logger.info(f"Deleted collection {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Error deleting collection {collection_name}: {e}")
            return False
    
    def get_collection_stats(self, user_id: int, document_id: int = None):
        """Get statistics about a collection"""
        collection = self.get_or_create_collection(user_id, document_id)
        return collection.count()