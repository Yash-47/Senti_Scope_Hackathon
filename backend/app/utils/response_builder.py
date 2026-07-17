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
    PostDetail,
    TopicIntelligence,
    BusinessIntelligence
)

def select_evidence(alert_title: str, posts: List[PostDetail], topics_res: dict) -> List[PostDetail]:
    """Selects up to 3 highest-confidence representative posts as supporting evidence."""
    evidence_posts = []
    title_lower = alert_title.lower()
    
    if "negative sentiment" in title_lower:
        neg_posts = [p for p in posts if p.sentiment.lower() == "negative"]
        evidence_posts = sorted(neg_posts, key=lambda p: p.confidence, reverse=True)[:3]
        
    elif "positive trend" in title_lower:
        pos_posts = [p for p in posts if p.sentiment.lower() == "positive"]
        evidence_posts = sorted(pos_posts, key=lambda p: p.confidence, reverse=True)[:3]
        
    elif "very low positive" in title_lower:
        neg_neu_posts = [p for p in posts if p.sentiment.lower() in ("neutral", "negative")]
        evidence_posts = sorted(neg_neu_posts, key=lambda p: p.confidence, reverse=True)[:3]
        
    elif "polarization" in title_lower:
        pos_posts = sorted([p for p in posts if p.sentiment.lower() == "positive"], key=lambda p: p.confidence, reverse=True)
        neg_posts = sorted([p for p in posts if p.sentiment.lower() == "negative"], key=lambda p: p.confidence, reverse=True)
        
        temp = []
        if pos_posts:
            temp.append(pos_posts[0])
            if len(pos_posts) > 1:
                temp.append(pos_posts[1])
        if neg_posts:
            temp.append(neg_posts[0])
            if len(neg_posts) > 1:
                temp.append(neg_posts[1])
        evidence_posts = temp[:3]
        
    elif "fear" in title_lower:
        fear_posts = [p for p in posts if p.emotion.lower() == "fear"]
        evidence_posts = sorted(fear_posts, key=lambda p: p.confidence, reverse=True)[:3]
        
    elif "anger" in title_lower:
        anger_posts = [p for p in posts if p.emotion.lower() == "anger"]
        evidence_posts = sorted(anger_posts, key=lambda p: p.confidence, reverse=True)[:3]
        
    elif "trending issue" in title_lower or "topic" in title_lower:
        keyword = "N/A"
        if topics_res:
            top_complaint = topics_res.get("top_complaint")
            if top_complaint and top_complaint.get("keyword") != "N/A":
                keyword = top_complaint.get("keyword")
        
        if keyword != "N/A":
            matching = [p for p in posts if keyword.lower() in p.text.lower()]
            evidence_posts = sorted(matching, key=lambda p: p.confidence, reverse=True)[:3]
            
        if not evidence_posts:
            neg_posts = [p for p in posts if p.sentiment.lower() == "negative"]
            evidence_posts = sorted(neg_posts, key=lambda p: p.confidence, reverse=True)[:3]
            
    else:
        evidence_posts = sorted(posts, key=lambda p: p.confidence, reverse=True)[:3]
        
    return evidence_posts

def compute_alert_confidence(evidence: List[PostDetail]) -> str:
    """Computes overall alert confidence (High, Medium, Low)."""
    if not evidence:
        return "Low"
        
    num_posts = len(evidence)
    posts_score = 10 if num_posts >= 3 else (7 if num_posts == 2 else 4)
    
    avg_confidence = sum(p.confidence for p in evidence) / num_posts
    conf_score = avg_confidence * 10.0
    
    agreement_count = 0
    for p in evidence:
        s_lower = p.sentiment.lower()
        e_lower = p.emotion.lower()
        if s_lower == "negative" and e_lower in ("anger", "fear", "sadness", "disgust"):
            agreement_count += 1
        elif s_lower == "positive" and e_lower == "joy":
            agreement_count += 1
        elif s_lower == "neutral" and e_lower == "neutral":
            agreement_count += 1
            
    agreement_score = (agreement_count / num_posts) * 10.0
    
    total_score = posts_score + conf_score + agreement_score
    
    if total_score >= 23.0:
        return "High"
    elif total_score >= 14.0:
        return "Medium"
    else:
        return "Low"

def build_analyze_response(
    request_id: str,
    start_time: float,
    keyword: str,
    cached: bool,
    statistics: Statistics,
    topics: List[str],
    topic_intelligence: List[TopicIntelligence],
    business_intelligence: BusinessIntelligence,
    summary: str,
    alerts: List[Alert],
    posts: List[PostDetail]
) -> AnalyzeResponse:
    """Builds a standardized AnalyzeResponse Pydantic model with quality controls."""
    
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
    if statistics.negative_percent > 60.0 and "predominantly negative" not in summary.lower():
        summary = "The discussion is predominantly negative. " + summary
    if statistics.positive_percent < 10.0 and "very little positive discussion" not in summary.lower():
        summary = "Very little positive discussion was observed. " + summary

    valid_topics = []
    for topic in topics:
        topic_lower = topic.lower()
        exists = any(topic_lower in p.text.lower() for p in posts)
        if exists:
            valid_topics.append(topic)
        else:
            logger.info(f"Response Builder: Filtered out topic '{topic}' because it does not exist in any post.")

    seen_alerts = set()
    unique_alerts = []
    for a in alerts:
        alert_key = (a.title, a.type)
        if alert_key not in seen_alerts:
            evidence_posts = select_evidence(a.title, posts, topics_res)
            a.evidence = evidence_posts
            a.confidence = compute_alert_confidence(evidence_posts)
            
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
        topic_intelligence=topic_intelligence,
        business_intelligence=business_intelligence,
        summary=summary,
        alerts=unique_alerts,
        posts=posts,
        emotion_distribution=emo_dist
    )
