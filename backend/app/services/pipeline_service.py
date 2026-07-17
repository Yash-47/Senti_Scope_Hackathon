import asyncio
import datetime
from typing import List, Dict, Any
from loguru import logger

from app.services.cache_service import cache_service
from app.services.bluesky_service import bluesky_service
from app.services.preprocess_service import preprocess_service
from app.services.sentiment_service import sentiment_service
from app.services.emotion_service import emotion_service
from app.services.topic_service import topic_service
from app.services.summary_service import summary_service
from app.services.statistics_service import statistics_service
from app.services.alert_service import alert_service
from app.utils.response_builder import build_analyze_response
from app.models.response_models import AnalyzeResponse, PostDetail, BusinessIntelligence

from app.services.business_intelligence import (
    topic_intelligence_service,
    risk_service,
    insight_service
)

class PipelineService:
    """Service to orchestrate SentiScope's entire data processing pipeline."""

    async def analyze(self, keyword: str, request_id: str, start_time: float) -> AnalyzeResponse:
        """Runs the query analysis pipeline: Cache -> Reddit -> Clean -> ML models -> Metrics."""
        logger.info(f"Pipeline started for query: '{keyword}' | Request-ID: {request_id}")

        # 1. Check cache state
        cached_data = cache_service.get(keyword)
        if cached_data is not None:
            logger.info(f"CACHE HIT - serving cached analysis for query: '{keyword}'")
            return build_analyze_response(
                request_id=request_id,
                start_time=start_time,
                keyword=keyword,
                cached=True,
                statistics=cached_data["statistics"],
                topics=cached_data["topics"],
                topic_intelligence=cached_data.get("topic_intelligence", []),
                business_intelligence=cached_data.get("business_intelligence"),
                summary=cached_data["summary"],
                alerts=cached_data["alerts"],
                posts=cached_data["posts"]
            )

        logger.info(f"CACHE MISS - executing remote data pipeline for query: '{keyword}'")

        # 2. Asynchronously query raw posts from Bluesky
        raw_posts = await bluesky_service.fetch_posts(keyword)

        # 3. Clean raw text values and filter empty/deleted threads
        cleaned_posts = preprocess_service.preprocess(raw_posts)
        logger.info(f"Pipeline preprocessed {len(cleaned_posts)} posts for analysis.")

        # 4. Predict sentiment and emotion models concurrently for performance optimization
        analyzed_posts: List[Dict[str, Any]] = []

        async def analyze_post(post: Any) -> Dict[str, Any]:
            # Run sentiment and emotion services concurrently
            sent_task = sentiment_service.analyze(post.text)
            emo_task = emotion_service.analyze(post.text)
            
            sentiment_res, emotion_res = await asyncio.gather(sent_task, emo_task)

            # Format UTC timestamp to standard ISO 8601 representation
            dt = datetime.datetime.fromtimestamp(post.created_utc, datetime.timezone.utc)
            date_str = dt.isoformat().replace("+00:00", "Z")

            return {
                "text": post.text,
                "sentiment": sentiment_res["sentiment"],
                "confidence": sentiment_res["confidence"],
                "emotion": emotion_res["emotion"],
                "subreddit": post.subreddit,
                "author": post.author,
                "score": post.score,
                "comments": post.comments,
                "date": date_str,
                "post_url": post.permalink
            }

        if cleaned_posts:
            # Gather classifications concurrently
            tasks = [analyze_post(post) for post in cleaned_posts]
            analyzed_posts = await asyncio.gather(*tasks)

        # Map list elements to PostDetail objects
        posts_detail = [PostDetail(**p) for p in analyzed_posts]

        # 5. Extract top trending keywords
        post_texts = [p.text for p in cleaned_posts]
        topics = await topic_service.extract(post_texts)

        # 6. Calculate statistics over analyzed metrics
        statistics = statistics_service.calculate_statistics(analyzed_posts)

        # 7. Evaluate statistics to detect alerts
        alerts = alert_service.evaluate_alerts(
            total_posts=statistics.total_posts,
            positive_percent=statistics.positive_percent,
            negative_percent=statistics.negative_percent
        )

        # 8. Topic Intelligence Calculation
        topic_intel = topic_intelligence_service.generate_topic_intelligence(topics, posts_detail)

        # 9. Risk Assessment & Business Insights
        emo_dist = emotion_service.get_distribution()
        risk_assessment = risk_service.calculate_risk(statistics, emo_dist)
        insights = insight_service.generate_insights(
            statistics=statistics,
            emotion_distribution=emo_dist,
            topic_intelligence=topic_intel,
            alerts=alerts,
            posts=posts_detail,
            risk_assessment=risk_assessment
        )
        business_intelligence = BusinessIntelligence(
            insights=insights,
            risk_assessment=risk_assessment
        )

        # 10. Generate reporting summary (Gemini summarizes the deterministic BI findings)
        summary = await summary_service.generate_summary(
            keyword=keyword,
            positive_pct=statistics.positive_percent,
            negative_pct=statistics.negative_percent,
            top_topics=topics,
            statistics=statistics,
            alerts=alerts,
            posts=posts_detail,
            topic_intelligence=topic_intel,
            business_intelligence=business_intelligence
        )

        # 11. Store the intermediate metrics in Cache for subsequent requests
        cache_data = {
            "statistics": statistics,
            "topics": topics,
            "topic_intelligence": topic_intel,
            "business_intelligence": business_intelligence,
            "summary": summary,
            "alerts": alerts,
            "posts": posts_detail
        }
        cache_service.set(keyword, cache_data)

        # 12. Return final constructed response
        logger.info(f"Pipeline successfully completed for query: '{keyword}'")
        return build_analyze_response(
            request_id=request_id,
            start_time=start_time,
            keyword=keyword,
            cached=False,
            statistics=statistics,
            topics=topics,
            topic_intelligence=topic_intel,
            business_intelligence=business_intelligence,
            summary=summary,
            alerts=alerts,
            posts=posts_detail
        )

pipeline_service = PipelineService()
