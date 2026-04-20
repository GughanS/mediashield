from sentence_transformers import SentenceTransformer
from PIL import Image
import io

class EmbeddingService:
    def __init__(self):
        # We use a lightweight CLIP model for MVPs that fits well locally
        # clip-ViT-B-32 produces 512-dimensional embeddings
        self.model = SentenceTransformer('clip-ViT-B-32')

    def get_embedding(self, image_data: bytes):
        """
        Converts raw image bytes to a numpy array embedding using CLIP.
        """
        image = Image.open(io.BytesIO(image_data))
        embedding = self.model.encode(image)
        return embedding

embedding_service = EmbeddingService()
