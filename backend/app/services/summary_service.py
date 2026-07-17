from typing import List, Any
from loguru import logger
from app.services.gemini_service import gemini_service

class SummaryService:
    """Service to generate a business executive summary of the sentiment analysis."""

    async def generate_summary(
        self,
        keyword: str,
        positive_pct: float,
        negative_pct: float,
        top_topics: List[str],
        statistics: Any = None,
        alerts: Any = None,
        posts: Any = None,
        topic_intelligence: Any = None,
        business_intelligence: Any = None
    ) -> str:
        """Generates a professional business executive summary using Gemini.
        
        If Gemini fails, or if low-confidence conditions are met, falls back to the deterministic template generator.
        """
        total_posts_val = getattr(statistics, "total_posts", 0) if statistics else 0
        
        # 1. Enforce Low Confidence Handling Guard Clause
        if total_posts_val < 5 or len(top_topics) == 0 or not alerts:
            logger.info("Summary Service: Low confidence detected (posts < 5, no topics, or no alerts). Skipping Gemini.")
            return self._generate_deterministic_summary(keyword, positive_pct, negative_pct, top_topics)

        # 2. Compile structured analytics JSON payload
        from app.services.emotion_service import emotion_service
        emo_dist = emotion_service.get_distribution()

        posts_context = []
        if posts:
            top_posts = sorted(posts, key=lambda p: getattr(p, "score", 0), reverse=True)[:3]
            posts_context = [
                {
                    "text": getattr(p, "text", ""),
                    "sentiment": getattr(p, "sentiment", ""),
                    "emotion": getattr(p, "emotion", ""),
                    "likes": getattr(p, "score", 0)
                }
                for p in top_posts
            ]

        alerts_list = []
        if alerts:
            alerts_list = [
                {
                    "title": getattr(a, "title", ""),
                    "description": getattr(a, "description", ""),
                    "priority": getattr(a, "priority", ""),
                    "type": getattr(a, "type", "")
                }
                for a in alerts
            ]

        stats_dict = {
            "totalPosts": total_posts_val,
            "positivePercent": getattr(statistics, "positive_percent", 0.0),
            "neutralPercent": getattr(statistics, "neutral_percent", 0.0),
            "negativePercent": getattr(statistics, "negative_percent", 0.0)
        }

        metadata_dict = {
            "collectionTimeWindow": "Recent real-time social media stream snapshot",
            "source": "Bluesky"
        }

        # Format topic intelligence for LLM
        topic_intel_payload = []
        if topic_intelligence:
            topic_intel_payload = [
                {
                    "topic": ti.topic,
                    "mentions": ti.mentions,
                    "averageSentiment": ti.average_sentiment,
                    "dominantEmotion": ti.dominant_emotion,
                    "averageConfidence": ti.average_confidence,
                    "engagementScore": ti.engagement_score,
                    "priority": ti.priority
                }
                for ti in topic_intelligence
            ]

        # Format business intelligence (insights & risk) for LLM (evidence posts excluded for brevity and safety)
        bi_payload = {}
        if business_intelligence:
            insights_list = [
                {
                    "id": ins.id,
                    "category": ins.category,
                    "title": ins.title,
                    "description": ins.description,
                    "priority": ins.priority,
                    "importanceScore": ins.importance_score,
                    "confidence": ins.confidence,
                    "supportingMetrics": [
                        {"label": sm.label, "value": sm.value, "unit": sm.unit}
                        for sm in ins.supporting_metrics
                    ]
                }
                for ins in business_intelligence.insights
            ]
            ra = business_intelligence.risk_assessment
            risk_dict = {
                "riskLevel": ra.risk_level,
                "riskScore": ra.risk_score,
                "reason": ra.reason,
                "supportingMetrics": ra.supporting_metrics
            }
            bi_payload = {
                "insights": insights_list,
                "riskAssessment": risk_dict
            }

        gemini_payload = {
            "keyword": keyword,
            "statistics": stats_dict,
            "emotionDistribution": emo_dist,
            "topics": top_topics,
            "topicIntelligence": topic_intel_payload,
            "businessIntelligence": bi_payload,
            "alerts": alerts_list,
            "representativePosts": posts_context,
            "metadata": metadata_dict
        }

        # 3. Try generating summary using Gemini
        try:
            logger.info(f"Summary Service: Triggering Gemini Executive Summary for keyword '{keyword}'...")
            summary_text = await gemini_service.generate_executive_summary(gemini_payload)
            logger.info("Summary Service: Gemini Executive Summary successfully generated.")
            return summary_text
        except Exception as e:
            logger.warning(f"Summary Service: Gemini summary failed or timed out ({str(e)}). Falling back to deterministic summary...")

        # 4. Fallback: Local Deterministic Generator
        return self._generate_deterministic_summary(keyword, positive_pct, negative_pct, top_topics)

    def _generate_deterministic_summary(
        self,
        keyword: str,
        positive_pct: float,
        negative_pct: float,
        top_topics: List[str]
    ) -> str:
        """Original deterministic fallback executive summary logic."""
        from app.services.emotion_service import emotion_service
        from app.services.topic_service import topic_service

        emo_dist = emotion_service.get_distribution()
        topics_res = topic_service.get_latest_results()

        sentences = []

        sentiment_tone = "mixed and balanced"
        if positive_pct >= 50.0:
            sentiment_tone = "predominantly positive"
        elif negative_pct >= 50.0:
            sentiment_tone = "primarily critical and cautious"

        if negative_pct > 60.0:
            sentences.append(f"The discussion surrounding '{keyword}' is predominantly negative.")
        else:
            sentences.append(f"Public discussions regarding '{keyword}' reflect a {sentiment_tone} sentiment tone.")

        if positive_pct < 10.0:
            sentences.append("Very little positive discussion was observed.")
        else:
            praise = topics_res.get("top_praise") if topics_res else None
            if praise and praise.get("keyword") != "N/A":
                sentences.append(f"Most positive discussion focused on {praise['keyword']} ({praise['category']}).")
            else:
                sentences.append("Positive discussion was limited.")

        complaint = topics_res.get("top_complaint") if topics_res else None
        if complaint and complaint.get("keyword") != "N/A":
            sentences.append(f"Conversely, primary concerns and negative complaints centered around '{complaint['keyword']}' ({complaint['category']}).")

        emotions_sorted = sorted([(e, pct) for e, pct in emo_dist.items() if e != "Neutral"], key=lambda x: x[1], reverse=True)
        if emotions_sorted and emotions_sorted[0][1] > 15.0:
            dom_emo, dom_pct = emotions_sorted[0]
            sentences.append(f"Emotional analytics reveal elevated levels of {dom_emo} ({dom_pct}%).")

        overall_topics = topics_res.get("overall_topics", []) if topics_res else []
        if overall_topics:
            kws = [t["keyword"] for t in overall_topics[:3] if t["keyword"] != "N/A"]
            if kws:
                sentences.append(f"Key themes of conversation center on {', '.join(kws)}.")

        summary_text = " ".join(sentences)

        words = summary_text.split()
        if len(words) > 120:
            summary_text = " ".join(words[:120]) + "."

        return summary_text

# Reusable singleton instance
summary_service = SummaryService()
