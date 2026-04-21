import time
import uuid
import random
import requests
import urllib.parse
from models.schemas import FeedItem

try:
    from duckduckgo_search import DDGS
    HAS_DDGS = True
except ImportError:
    HAS_DDGS = False

class PublicFeedCrawler:
    def __init__(self):
        self.headers = {'User-Agent': 'Mozilla/5.0'}

    def search_related_posts(self, query_context: str, count: int = 5) -> list[FeedItem]:
        """
        Dynamically generates/crawls internet posts based on the provided query context.
        """
        all_posts = []
        
        # Enforce search context to purely sports domain to avoid irrelevant DDG hits
        search_query = query_context if "sport" in query_context.lower() else f"{query_context} sports news"

        # 1. Fetch real internet intel via DDGS (News and Video streams matching the exact query)
        if HAS_DDGS:
            try:
                with DDGS() as ddgs:
                    # Real journalistic/blog sources
                    news_results = list(ddgs.news(search_query, max_results=3))
                    for res in news_results:
                        all_posts.append(FeedItem(
                            id=str(uuid.uuid4())[:8],
                            source=f"NEWS: {res.get('source', 'Web')}",
                            text_content=f"{res.get('title', '')} - {res.get('body', '')}",
                            post_url=res.get("url"),
                            image_url=res.get("image"),
                            timestamp=time.time()
                        ))
            except Exception as e:
                pass
                
            try:    
                with DDGS() as ddgs:
                    # Real video platforms (YouTube, Dailymotion, TikTok hits)
                    video_results = list(ddgs.videos(search_query, max_results=3))
                    for res in video_results:
                        all_posts.append(FeedItem(
                            id=str(uuid.uuid4())[:8],
                            source=f"VIDEO: {res.get('publisher', 'Web')}",
                            text_content=res.get("title", ""),
                            post_url=res.get("content"),
                            image_url=res.get("images", {}).get("large") if isinstance(res.get("images"), dict) else None,
                            timestamp=time.time()
                        ))
            except Exception as e:
                pass
        
        # 2. Add some random noise if the query produced 0 actual web hits
        if len(all_posts) < count:
            try:
                r = requests.get("https://www.reddit.com/r/sports/new.json?limit=2", headers=self.headers, timeout=5)
                if r.status_code == 200:
                    for child in r.json().get('data', {}).get('children', []):
                        title = child['data'].get('title', '')
                        permalink = child['data'].get('permalink', '')
                        all_posts.append(FeedItem(
                            id=str(uuid.uuid4())[:8],
                            source="Reddit /r/sports",
                            text_content=title,
                            post_url=f"https://www.reddit.com{permalink}" if permalink else None,
                            timestamp=time.time()
                        ))
            except:
                pass

        # 3. Last fallback
        if not all_posts:
             encoded_query = urllib.parse.quote_plus(query_context)
             all_posts = [
                FeedItem(
                    id=str(uuid.uuid4())[:8],
                    source="YouTube (Search fallback)",
                    text_content=f"No direct hits found. Redirecting to manual query sweep.",
                    post_url=f"https://www.youtube.com/results?search_query={encoded_query}",
                    timestamp=time.time() - 3600
                )
             ]

        random.shuffle(all_posts)
        return all_posts[:count]

feed_crawler = PublicFeedCrawler()
