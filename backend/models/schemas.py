from pydantic import BaseModel
from typing import Optional, Dict, Any

class UploadResponse(BaseModel):
    status: str
    id: int
    message: str

class MatchResult(BaseModel):
    similarity_score: float
    match_info: Optional[Dict[str, Any]]
    status: str
    triage: Optional[Dict[str, Any]]

class FeedItem(BaseModel):
    id: str
    source: str
    text_content: str
    image_url: Optional[str] = None
    post_url: Optional[str] = None
    timestamp: float

class PostScanResult(BaseModel):
    feed_item: FeedItem
    trust_score: int
    classification: str
    flags: list[str]
    match_score: float
    matched_media: Optional[Dict[str, Any]] = None
    reasoning: str

class InvestigationResponse(BaseModel):
    incident_id: str
    overall_trust_score: int
    summary: str
    related_posts: list[PostScanResult]
