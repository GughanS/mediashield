import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
os.environ["USE_TF"] = "0"

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services.embedding_service import embedding_service
from services.vector_db import vector_db
from services.gemini_service import gemini_service
from services.public_feed_crawler import feed_crawler
from models.schemas import UploadResponse, MatchResult, PostScanResult, InvestigationResponse
import sys
import uuid

app = FastAPI(title="MediaShield AI: Active Investigation API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scripts_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
if scripts_dir not in sys.path:
    sys.path.append(scripts_dir)
try:
    from test_data_generator import generate_test_data
except ImportError:
    generate_test_data = None


@app.get("/")
def read_root():
    return {"status": "MediaShield AI Backend Running"}

@app.post("/upload_official_media", response_model=UploadResponse)
async def upload_official(file: UploadFile = File(...), title: str = Form(default="Untitled")):
    """Ingest official media into the system and store its embedding."""
    image_data = await file.read()
    embedding = embedding_service.get_embedding(image_data)
    media_info = {"title": title, "filename": file.filename, "type": "official"}
    item_id = vector_db.add_embedding(embedding, media_info)
    
    return UploadResponse(status="success", id=item_id, message="Media indexed.")

@app.post("/investigate_incident", response_model=InvestigationResponse)
async def investigate_incident(
    file: UploadFile = File(...), 
    context_claim: str = Form(default="Check this anomaly")
):
    """
    Active Investigation Tool: 
    1. Analyzes uploaded incident.
    2. Uses crawler to search the web for related posts.
    3. Triages all related posts using Gemini.
    """
    image_data = await file.read()
    
    # Check if incident image matches any legitimate vectors (optional metadata usage)
    embedding = embedding_service.get_embedding(image_data)
    match_info, similarity = vector_db.search_embedding(embedding)
    
    # 1. Ask crawler to reverse search the web for the provided claim
    related_feed_items = feed_crawler.search_related_posts(query_context=context_claim, count=4)
    
    scanned_results = []
    total_trust = 0
    
    # 2. Iteratively process Gemini Forensics on each discovered web result
    for item in related_feed_items:
        triage_report = gemini_service.analyze_suspect_media(
            image_data=image_data, 
            match_score=similarity if similarity else 0.0,
            context_text=item.text_content
        )
        
        trust_score = triage_report.get("trust_score", 50)
        total_trust += trust_score
        
        scanned_results.append(PostScanResult(
            feed_item=item,
            trust_score=trust_score,
            classification=triage_report.get("classification", "Unknown"),
            flags=triage_report.get("flags", []),
            match_score=similarity if similarity else 0.0,
            matched_media=match_info,
            reasoning=triage_report.get("reasoning", "")
        ))

    avg_trust = int(total_trust / max(1, len(related_feed_items)))

    return InvestigationResponse(
        incident_id=str(uuid.uuid4())[:8],
        overall_trust_score=avg_trust,
        summary=f"Found {len(related_feed_items)} posts across the internet matching this incident.",
        related_posts=scanned_results
    )
