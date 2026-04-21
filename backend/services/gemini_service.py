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
        # We use a generative multimodal model for triage tasks
        self.model = genai.GenerativeModel('gemini-3-flash-preview')

    def analyze_suspect_media(self, image_data: bytes, match_score: float, context_text: str = "") -> dict:
        """
        Calls Gemini to triangulate whether the media is piracy, an edit, or fair use.
        """
        if not API_KEY:
            return {"classification": "Config Error", "confidence": 0, "reasoning": "Missing GEMINI_API_KEY."}

        image = Image.open(io.BytesIO(image_data))
        
        prompt = f'''
        You are an AI forensics expert working for VectorGuard, a sports media protection system tracking misinformation and piracy.
        An internet post has been flagged because its image matches an official broadcast image with a similarity score of {match_score:.2f}%.
        The text context scraped LIVE from the web today surrounding the image is: "{context_text}".

        CRITICAL INSTRUCTION: You must base your judgements entirely on this live scraped text context, as your internal training data may not reflect current ongoing events. Do not hallucinate past sporting events!

        Compare the content of the image with the provided live text context. Perform semantic cross-referencing. Is the post spreading Fake News? Is it misinterpreting the image to create a false narrative? Or is it illegally pirating media?

        Based on the image and the text context, output a structured JSON response. Use the following schema EXACTLY:
        {{
            "classification": "Fake News" | "Malicious Piracy" | "Misappropriated" | "Authentic/Benign" | "Unknown",
            "trust_score": 0-100 (integer, 100 means fully authentic and trustworthy, 0 means malicious fake news or blatant piracy),
            "flags": ["list", "of", "strings", "representing", "flags like 'Deceptive Context', 'Deepfake Suspected', 'Piracy', 'Out of Context'"],
            "reasoning": "Detailed explanation of why you made this judgement based on the visual and textual evidence."
        }}
        
        Output only the raw JSON.
        '''
        
        try:
            response = self.model.generate_content([prompt, image])
            response_text = response.text.strip()
            
            # Clean potential markdown
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
                "confidence": 0,
                "reasoning": f"Failed to generate analysis: {str(e)}"
            }

gemini_service = GeminiService()
