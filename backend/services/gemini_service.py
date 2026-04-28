import os
import google.generativeai as genai
from PIL import Image
import io
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

class GeminiService:
    def __init__(self):
        # We use a robust generative multimodal model for high-accuracy triage tasks
        self.model = genai.GenerativeModel(
            'gemini-3-flash-preview', 
            generation_config={"response_mime_type": "application/json"}
        )

    def analyze_suspect_media(self, image_data: bytes, match_score: float, context_text: str = "") -> dict:
        """
        Calls Gemini to triangulate whether the media is piracy, an edit, or fair use.
        """
        if not API_KEY:
            return {
                "classification": "Error", 
                "trust_score": 0, 
                "flags": ["Missing API Key"],
                "reasoning": "Missing GEMINI_API_KEY."
            }

        image = Image.open(io.BytesIO(image_data))
        
        prompt = f'''
        You are an elite AI forensics expert working for VectorGuard, a sports media protection system tracking misinformation and piracy.
        An internet post has been flagged because its image matches an official broadcast image with a similarity score of {match_score:.2f}%.
        The text context scraped LIVE from the web today surrounding the image is: "{context_text}".

        CRITICAL INSTRUCTION: You must base your judgements entirely on the visual evidence in the image and the live scraped text context.
        Perform a highly accurate, rigorous semantic cross-referencing between the image content and the text context.
        
        Key Questions to Answer:
        1. Does the text misrepresent what is actually happening in the image? (Fake News / Misappropriated)
        2. Is the user blatantly sharing unauthorized broadcast footage? (Malicious Piracy)
        3. Is the usage benign, fair use, or an authentic post from an official source? (Authentic/Benign)

        Output a structured JSON response. You MUST use the following schema exactly:
        {{
            "classification": "Fake News" | "Malicious Piracy" | "Misappropriated" | "Authentic/Benign" | "Unknown",
            "trust_score": <integer 0-100> (100 means fully authentic and trustworthy, 0 means malicious fake news or blatant piracy),
            "flags": ["list", "of", "strings", "representing", "flags like 'Deceptive Context', 'Deepfake Suspected', 'Piracy', 'Out of Context'"],
            "reasoning": "Detailed, factual explanation of why you made this judgement based on the visual and textual evidence."
        }}
        '''
        
        try:
            response = self.model.generate_content([prompt, image])
            response_text = response.text.strip()
            
            # Clean potential markdown just in case, though response_mime_type should prevent it
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
                
            return json.loads(response_text)
        except Exception as e:
            return {
                "classification": "Error",
                "trust_score": 50,
                "flags": ["Error during analysis"],
                "reasoning": f"Failed to generate analysis: {str(e)}"
            }

gemini_service = GeminiService()
