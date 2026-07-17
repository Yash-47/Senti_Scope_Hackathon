import time
import hashlib
from datetime import datetime, timezone
from typing import List
from loguru import logger
from app.models.response_models import (
    AnalyzeResponse,
    ResponseMetadata,
    Statistics,
    Alert,
    PostDetail
)

def build_analyze_response(
    request_id: str,
    start_time: float,
    keyword: str,
    cached: bool,
    statistics: Statistics,
    topics: List[str],
    summary: str,
    alerts: List[Alert],
    posts: List[PostDetail]
) -> AnalyzeResponse:
    """Builds a standardized AnalyzeResponse Pydantic model with quality controls.

    Args:
        request_id (str): The unique UUID tracking the current request.
        start_time (float): The perf_counter() timestamp taken at the request start.
        keyword (str): The search query keyword.
        cached (bool): True if the result was fetched from cache.
        statistics (Statistics): Calculated statistics object.
        topics (List[str]): List of top keywords.
        summary (str): AI executive summary string.
        alerts (List[Alert]): High/medium/low priority alerts list.
        posts (List[PostDetail]): Processed posts list.

    Returns:
        AnalyzeResponse: Typed output response model.
    """
    
    # 1. Fetch emotion distribution and latest topic results dynamically
    from app.services.emotion_service import emotion_service
    from app.services.topic_service import topic_service

    emo_dist = emotion_service.get_distribution()
    topics_res = topic_service.get_latest_results()

    # Trigger additional deterministic alerts based on thresholds
    # High Polarization: Positive > 30% and Negative > 30%
    if statistics.positive_percent > 30.0 and statistics.negative_percent > 30.0:
        alerts.append(
            Alert(
                type="warning",
                priority="medium",
                title="High Polarization",
                description=(
                    f"Public opinion is polarized, with positive sentiment at {statistics.positive_percent}% "
                    f"and negative sentiment at {statistics.negative_percent}%."
                )
            )
        )

    # Very Low Positive Sentiment: Positive < 15%
    if statistics.positive_percent < 15.0:
        alerts.append(
            Alert(
                type="danger",
                priority="high",
                title="Very Low Positive Sentiment",
                description=(
                    f"Positive discussion is severely depressed at {statistics.positive_percent}%, "
                    f"reflecting low customer satisfaction or poor public engagement."
                )
            )
        )

    # High Fear: Fear > 25%
    if emo_dist.get("Fear", 0.0) > 25.0:
        alerts.append(
            Alert(
                type="warning",
                priority="high",
                title="High Fear",
                description=(
                    f"Anxiety and concern are elevated, with Fear representing {emo_dist['Fear']}% "
                    f"of the emotional distribution."
                )
            )
        )

    # High Anger: Anger > 25%
    if emo_dist.get("Anger", 0.0) > 25.0:
        alerts.append(
            Alert(
                type="danger",
                priority="high",
                title="High Anger",
                description=(
                    f"Frustration and anger are highly elevated at {emo_dist['Anger']}%, "
                    f"signalling significant user outrage or active complaints."
                )
            )
        )

    # Trending Issue Detected: Top Complaint is valid and Negative > 35%
    if topics_res:
        top_complaint = topics_res.get("top_complaint")
        if top_complaint and top_complaint.get("keyword") != "N/A" and statistics.negative_percent > 35.0:
            alerts.append(
                Alert(
                    type="warning",
                    priority="medium",
                    title="Trending Issue Detected",
                    description=(
                        f"A primary complaint has emerged regarding '{top_complaint['keyword']}' ({top_complaint['category']}), "
                        f"correlating with elevated negative discussion."
                    )
                )
            )

    # 2. Quality Checks & Verification
    # Ensure Summary agrees with statistics
    if statistics.negative_percent > 60.0 and "predominantly negative" not in summary.lower():
        summary = "The discussion is predominantly negative. " + summary
    if statistics.positive_percent < 10.0 and "very little positive discussion" not in summary.lower():
        summary = "Very little positive discussion was observed. " + summary

    # Ensure Topics exist in the analyzed posts
    valid_topics = []
    for topic in topics:
        topic_lower = topic.lower()
        exists = any(topic_lower in p.text.lower() for p in posts)
        if exists:
            valid_topics.append(topic)
        else:
            logger.info(f"Response Builder: Filtered out topic '{topic}' because it does not exist in any post.")

    # Deduplicate alerts
    seen_alerts = set()
    unique_alerts = []
    for a in alerts:
        alert_key = (a.title, a.type)
        if alert_key not in seen_alerts:
            seen_alerts.add(alert_key)
            unique_alerts.append(a)

    duration_ms = (time.perf_counter() - start_time) * 1000
    processing_time_str = f"{duration_ms:.2f}ms"
    current_time_iso = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    metadata = ResponseMetadata(
        request_id=request_id,
        timestamp=current_time_iso,
        processing_time=processing_time_str,
        source="Bluesky",
        keyword=keyword,
        cached=cached
    )

    return AnalyzeResponse(
        metadata=metadata,
        statistics=statistics,
        topics=valid_topics,
        summary=summary,
        alerts=unique_alerts,
        posts=posts,
        emotion_distribution=emo_dist
    )
