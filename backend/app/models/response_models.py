from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from typing import List, Optional, Dict, Any


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

class Alert(CamelModel):
    type: str = Field(..., description="Alert classification type (e.g., 'warning', 'info').")
    priority: str = Field(..., description="Priority tier (e.g., 'high', 'medium', 'low').")
    title: str = Field(..., description="Short summary of the alert condition.")
    description: str = Field(..., description="Detailed description of the trigger event.")
    confidence: str = Field(default="Medium", description="Overall alert confidence (High, Medium, Low).")
    evidence: List[PostDetail] = Field(default_factory=list, description="Supporting evidence posts.")

class TopicIntelligence(CamelModel):
    topic: str = Field(..., description="Extracted topic keyword name.")
    mentions: int = Field(..., description="Count of posts mentioning this topic.")
    average_sentiment: str = Field(..., description="Dominant average sentiment for the topic.")
    dominant_emotion: str = Field(..., description="Dominant emotion detected in topic posts.")
    average_confidence: float = Field(..., description="Average classifier confidence score for this topic.")
    engagement_score: float = Field(..., description="Weighted average engagement score.")
    priority: str = Field(..., description="Computed priority rating (Low, Medium, High, Critical).")

class SupportingMetric(CamelModel):
    label: str = Field(..., description="Label description of the metric.")
    value: Any = Field(..., description="Value of the supporting metric.")
    unit: Optional[str] = Field(default=None, description="Optional unit (e.g., '%', 'posts').")

class EvidencePost(CamelModel):
    author: str = Field(..., description="Author username handle.")
    text: str = Field(..., description="Exact quoted post content.")
    url: str = Field(..., description="Permalink URL to the Bluesky post.")
    sentiment: str = Field(..., description="Predicted sentiment label.")
    emotion: str = Field(..., description="Predicted emotion label.")
    confidence: float = Field(..., description="Model classification confidence score.")

class Insight(CamelModel):
    id: str = Field(..., description="Unique stable identifier for this insight.")
    category: str = Field(..., description="Insight category classification.")
    title: str = Field(..., description="Brief headline of the insight.")
    description: str = Field(..., description="Detailed description containing concrete numbers.")
    priority: str = Field(..., description="Priority tier rating ('low', 'medium', 'high', 'critical').")
    importance_score: int = Field(..., description="Normalized importance rating (0-100).")
    confidence: str = Field(..., description="Confidence tier classification ('High', 'Medium', 'Low').")
    supporting_metrics: List[SupportingMetric] = Field(default_factory=list, description="Supporting data metrics.")
    evidence: List[EvidencePost] = Field(default_factory=list, description="Selected evidence posts.")

class RiskAssessment(CamelModel):
    risk_level: str = Field(..., description="Aggregated risk tier ('Low', 'Medium', 'High', 'Critical').")
    risk_score: int = Field(..., description="Aggregated risk score (0-100).")
    reason: str = Field(..., description="Reasoning statement describing the risk triggers.")
    supporting_metrics: Dict[str, Any] = Field(default_factory=dict, description="Supporting metrics key-values.")

class BusinessIntelligence(CamelModel):
    insights: List[Insight] = Field(default_factory=list, description="List of generated business insights.")
    risk_assessment: RiskAssessment = Field(..., description="Aggregated business risk assessment.")

class AnalyzeResponse(CamelModel):
    metadata: ResponseMetadata
    statistics: Statistics
    topics: List[str] = Field(..., description="Top extracted keywords sorted by frequency.")
    topic_intelligence: List[TopicIntelligence] = Field(default_factory=list, description="Structured analytics per topic.")
    business_intelligence: BusinessIntelligence = Field(..., description="Deterministic business intelligence findings.")
    summary: str = Field(..., description="AI executive summary text.")
    alerts: List[Alert] = Field(..., description="List of detected anomalies or warnings.")
    posts: List[PostDetail] = Field(..., description="List of individual preprocessed and classified posts.")
    emotion_distribution: Optional[Dict[str, float]] = Field(default=None, description="Aggregate emotion distribution.")
