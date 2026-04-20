import random
import uuid
import time
from models.schemas import FeedItem

SOURCES = ["Twitter/X", "Reddit", "Facebook", "TikTok", "SportsBlog"]
TEXTS = [
    "Check out this amazing dunk from last night! #basketball",
    "BREAKING: LeBron transfers to Real Madrid soccer team! (Fake News)",
    "Can't believe the ref called this a foul smh",
    "HD Live Stream for the NBA finals right here, click the link in bio! #piracy",
    "Rumor: The league is rigged, look at this frame from the broadcast where the ball disappears.",
    "Such an incredible moment, glad I was there to witness it natively.",
    "[SPONSORED] Get 50% off sports gear using promo code DUNK",
    "Leaked footage shows players conspiring with refs before the quarter! Unbelievable.",
]

class FeedSimulator:
    def __init__(self):
        pass

    def generate_posts(self, count=2) -> list[FeedItem]:
        posts = []
        for _ in range(count):
            item = FeedItem(
                id=str(uuid.uuid4())[:8],
                source=random.choice(SOURCES),
                text_content=random.choice(TEXTS),
                image_url=None, # To be hydrated dynamically
                timestamp=time.time()
            )
            posts.append(item)
        return posts

feed_simulator = FeedSimulator()
