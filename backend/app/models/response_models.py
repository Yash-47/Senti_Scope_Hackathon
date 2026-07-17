from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from typing import List, Optional, Dict


class CamelModel(BaseModel):
    """Base model automatically translating snake_case fields to camelCase JSON keys."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class ResponseMetadata(CamelModel):
    request_id: str = Field(..., description="Unique transaction ID for this analytics run.")
    timestamp: str = Field(..., description="ISO 8601 timestamp of request completion.")
    processing_time: str = Field(..., description="Time taken to process query (e.g. '154ms').")
    source: str = Field("Bluesky", description="Raw text data feed provider.")
    keyword: str = Field(..., description="The query keyword that was analyzed.")
    cached: bool = Field(..., description="True if analysis was fetched from cached memory.")

class Statistics(CamelModel):
    total_posts: int = Field(..., description="Total posts retrieved and analyzed.")
    positive_percent: float = Field(..., description="Percentage of positive sentiment posts.")
    neutral_percent: float = Field(..., description="Percentage of neutral sentiment posts.")
    negative_percent: float = Field(..., description="Percentage of negative sentiment posts.")
    average_comments: float = Field(..., description="Average comment count per post.")
    
    # Legacy fields (kept optional for backward compatibility)
    average_score: Optional[float] = Field(default=None, description="Average score (upvotes) across posts.")
    most_active_subreddit: Optional[str] = Field(default=None, description="Handle with the highest volume of posts.")
    
    # Bluesky specific fields
    average_likes: Optional[float] = Field(default=None, description="Average likes count per post.")
    most_active_author: Optional[str] = Field(default=None, description="Most active author handle.")

class Alert(CamelModel):
    type: str = Field(..., description="Alert classification type (e.g., 'warning', 'info').")
    priority: str = Field(..., description="Priority tier (e.g., 'high', 'medium', 'low').")
    title: str = Field(..., description="Short summary of the alert condition.")
    description: str = Field(..., description="Detailed description of the trigger event.")

class PostDetail(CamelModel):
    text: str = Field(..., description="Cleaned, combined post title and body content.")
    sentiment: str = Field(..., description="Predicted sentiment category (Positive, Negative, Neutral).")
    confidence: float = Field(..., description="Classifier confidence score.")
    emotion: str = Field(..., description="Predicted emotion classification (Joy, Anger, etc.).")
    subreddit: str = Field(..., description="The user handle where the post was retrieved.")
    author: str = Field(..., description="Bluesky author username.")
    score: int = Field(..., description="Upvote score of the thread.")
    comments: int = Field(..., description="Number of replies on the post.")
    date: str = Field(..., description="ISO 8601 formatting of post publication date.")
    post_url: str = Field(default="", description="The URL to the original Bluesky post.")

class AnalyzeResponse(CamelModel):
    metadata: ResponseMetadata
    statistics: Statistics
    topics: List[str] = Field(..., description="Top extracted keywords sorted by frequency.")
    summary: str = Field(..., description="AI executive summary text.")
    alerts: List[Alert] = Field(..., description="List of detected anomalies or warnings.")
    posts: List[PostDetail] = Field(..., description="List of individual preprocessed and classified posts.")
    emotion_distribution: Optional[Dict[str, float]] = Field(default=None, description="Aggregate emotion distribution.")

