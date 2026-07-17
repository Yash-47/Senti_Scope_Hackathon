from typing import List
from app.services.bluesky_service import BlueskyPost
from app.utils.text_cleaner import clean_text

class PreprocessedPost:
    """Represents a sanitized text post containing cleaned content and original metadata."""
    def __init__(self, text: str, raw_post: BlueskyPost):
        self.text = text
        self.subreddit = raw_post.subreddit
        self.author = raw_post.author
        self.score = raw_post.score
        self.comments = raw_post.comments
        self.created_utc = raw_post.created_utc
        self.permalink = raw_post.permalink

class PreprocessService:
    """Service to handle merging, cleaning, and filtering of raw Reddit posts."""
    
    def preprocess(self, raw_posts: List[BlueskyPost]) -> List[PreprocessedPost]:
        """Cleans post contents, filters empty/deleted posts, and returns preprocessed objects."""
        preprocessed_list: List[PreprocessedPost] = []

        for post in raw_posts:
            # Check and ignore deleted or removed posts
            body_lower = post.body.strip().lower()
            title_lower = post.title.strip().lower()
            if body_lower in ["[deleted]", "[removed]"] or title_lower in ["[deleted]", "[removed]"]:
                continue

            # Merge title and body (selftext)
            merged = f"{post.title} {post.body}".strip()

            # Execute Regex cleaning pipeline
            cleaned = clean_text(merged)

            # Skip empty or whitespace-only outcomes
            if not cleaned:
                continue

            preprocessed_list.append(PreprocessedPost(text=cleaned, raw_post=post))

        return preprocessed_list

# Reusable singleton instance
preprocess_service = PreprocessService()
