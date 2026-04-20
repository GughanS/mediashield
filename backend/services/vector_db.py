import faiss
import numpy as np

class VectorDBService:
    def __init__(self, dimension=512):
        # L2 distance index for Faiss. We'll normalize vectors to mimic Cosine Similarity.
        self.index = faiss.IndexFlatL2(dimension)
        self.metadata = {}  # In-memory mapping from FAISS IDs to media info
        self.current_id = 0

    def add_embedding(self, embedding, media_info: dict):
        """
        Normalize and add embedding to the local FAISS index.
        """
        if len(embedding.shape) == 1:
            embedding = np.expand_dims(embedding, axis=0)
            
        # FAISS requires float32
        embedding_f32 = embedding.astype(np.float32)
        
        # Normalize to perform cosine similarity via L2
        faiss.normalize_L2(embedding_f32) 
        
        self.index.add(embedding_f32)
        self.metadata[self.current_id] = media_info
        
        assigned_id = self.current_id
        self.current_id += 1
        return assigned_id

    def search_embedding(self, embedding, k=1):
        """
        Search for the top_k closest matches. Returns matched metadata and a similarity percentage.
        """
        if self.index.ntotal == 0:
            return None, 0.0
            
        if len(embedding.shape) == 1:
            embedding = np.expand_dims(embedding, axis=0)
            
        embedding_f32 = embedding.astype(np.float32)
        faiss.normalize_L2(embedding_f32)
        
        distances, indices = self.index.search(embedding_f32, k)
        match_idx = indices[0][0]
        
        if match_idx == -1:
            return None, 0.0
            
        # Convert L2 distance to Similarity Percentage (0 to 100%)
        # For normalized L2, formula is: cosine_sim = 1 - (L2^2 / 2)
        distance_sq = distances[0][0]
        cosine_sim = 1.0 - (distance_sq / 2.0)
        similarity_percentage = max(0.0, cosine_sim) * 100
        
        match_info = self.metadata.get(match_idx, {})
        return match_info, similarity_percentage

vector_db = VectorDBService(dimension=512)
