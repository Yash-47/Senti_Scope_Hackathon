from typing import List, Dict, Any
from app.models.response_models import (
    Statistics,
    PostDetail,
    Alert,
    TopicIntelligence,
    RiskAssessment,
    Insight,
    SupportingMetric,
    EvidencePost
)

class InsightService:
    """Service to evaluate deterministic Business Insights and sort them correctly."""

    def generate_insights(
        self,
        statistics: Statistics,
        emotion_distribution: Dict[str, float],
        topic_intelligence: List[TopicIntelligence],
        alerts: List[Alert],
        posts: List[PostDetail],
        risk_assessment: RiskAssessment
    ) -> List[Insight]:
        insights: List[Insight] = []
        total_posts = statistics.total_posts
        pos_pct = statistics.positive_percent
        neu_pct = statistics.neutral_percent
        neg_pct = statistics.negative_percent
        avg_likes = statistics.average_likes if statistics.average_likes is not None else 0.0

        # Helper to convert PostDetail to EvidencePost
        def to_evidence(p_list: List[PostDetail]) -> List[EvidencePost]:
            return [
                EvidencePost(
                    author=p.author,
                    text=p.text,
                    url=p.post_url,
                    sentiment=p.sentiment,
                    emotion=p.emotion,
                    confidence=p.confidence
                )
                for p in p_list[:3]
            ]

        # -------------------------------------------------------------
        # 1. Sentiment Category
        # -------------------------------------------------------------
        if neg_pct > 45.0:
            neg_posts = [p for p in posts if p.sentiment.lower() == "negative"]
            sorted_neg = sorted(neg_posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="negative_dominance",
                    category="sentiment",
                    title="Negative sentiment dominates discussion",
                    description=f"Negative sentiment accounts for {neg_pct:.1f}% of analyzed discussion.",
                    priority="critical" if neg_pct > 60.0 else "high",
                    importance_score=int(round(neg_pct)),
                    confidence="High" if len(neg_posts) >= 3 else "Medium",
                    supporting_metrics=[
                        SupportingMetric(label="Negative Sentiment", value=float(round(neg_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(sorted_neg)
                )
            )

        if pos_pct > 45.0:
            pos_posts = [p for p in posts if p.sentiment.lower() == "positive"]
            sorted_pos = sorted(pos_posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="positive_dominance",
                    category="sentiment",
                    title="Positive sentiment dominates discussion",
                    description=f"Positive sentiment represents {pos_pct:.1f}% of analyzed discussion.",
                    priority="high" if pos_pct > 65.0 else "medium",
                    importance_score=int(round(pos_pct)),
                    confidence="High" if len(pos_posts) >= 3 else "Medium",
                    supporting_metrics=[
                        SupportingMetric(label="Positive Sentiment", value=float(round(pos_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(sorted_pos)
                )
            )

        if 25.0 <= pos_pct <= 50.0 and 25.0 <= neg_pct <= 50.0 and abs(pos_pct - neg_pct) < 15.0:
            mix_posts = sorted(posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="balanced_opinion",
                    category="sentiment",
                    title="Balanced public opinion",
                    description=f"Discussions reflect a balanced split, with positive sentiment at {pos_pct:.1f}% and negative at {neg_pct:.1f}%.",
                    priority="low",
                    importance_score=40,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Positive Sentiment", value=float(round(pos_pct, 1)), unit="%"),
                        SupportingMetric(label="Negative Sentiment", value=float(round(neg_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(mix_posts)
                )
            )

        if pos_pct > 30.0 and neg_pct > 30.0 and abs(pos_pct - neg_pct) < 10.0:
            mix_posts = sorted(posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="polarized_discussion",
                    category="sentiment",
                    title="Highly polarized public stance",
                    description=f"Opinion is polarized, with negative tone ({neg_pct:.1f}%) competing with positive tone ({pos_pct:.1f}%).",
                    priority="high",
                    importance_score=75,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Positive Sentiment", value=float(round(pos_pct, 1)), unit="%"),
                        SupportingMetric(label="Negative Sentiment", value=float(round(neg_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(mix_posts)
                )
            )

        if pos_pct < 15.0:
            neut_neg_posts = [p for p in posts if p.sentiment.lower() in ("neutral", "negative")]
            sorted_neut_neg = sorted(neut_neg_posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="low_positive_tone",
                    category="sentiment",
                    title="Severely depressed positive sentiment",
                    description=f"Positive tone is restricted to {pos_pct:.1f}%, showing minimal enthusiast backing.",
                    priority="high",
                    importance_score=80,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Positive Sentiment", value=float(round(pos_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(sorted_neut_neg)
                )
            )

        # -------------------------------------------------------------
        # 2. Emotion Category
        # -------------------------------------------------------------
        anger_pct = emotion_distribution.get("Anger", 0.0)
        fear_pct = emotion_distribution.get("Fear", 0.0)
        joy_pct = emotion_distribution.get("Joy", 0.0)
        sad_pct = emotion_distribution.get("Sadness", 0.0)
        disgust_pct = emotion_distribution.get("Disgust", 0.0)
        neg_emotions_total = anger_pct + fear_pct + sad_pct + disgust_pct

        if fear_pct > 25.0:
            fear_posts = [p for p in posts if p.emotion.lower() == "fear"]
            sorted_fear = sorted(fear_posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="fear_dominance",
                    category="emotion",
                    title="Fear dominates discussion",
                    description=f"Anxiety and concern are elevated, with Fear representing {fear_pct:.1f}% of the emotion metrics.",
                    priority="high",
                    importance_score=int(round(fear_pct + 20)),
                    confidence="High" if len(fear_posts) >= 3 else "Medium",
                    supporting_metrics=[
                        SupportingMetric(label="Fear Emotion", value=float(round(fear_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(sorted_fear)
                )
            )

        if anger_pct > 25.0:
            anger_posts = [p for p in posts if p.emotion.lower() == "anger"]
            sorted_anger = sorted(anger_posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="anger_dominance",
                    category="emotion",
                    title="Anger is unusually high",
                    description=f"Frustration and anger are highly elevated at {anger_pct:.1f}%, signalling potential outrage.",
                    priority="critical",
                    importance_score=int(round(anger_pct + 30)),
                    confidence="High" if len(anger_posts) >= 3 else "Medium",
                    supporting_metrics=[
                        SupportingMetric(label="Anger Emotion", value=float(round(anger_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(sorted_anger)
                )
            )

        if joy_pct > 25.0:
            joy_posts = [p for p in posts if p.emotion.lower() == "joy"]
            sorted_joy = sorted(joy_posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="joy_dominance",
                    category="emotion",
                    title="Conversation is optimistic",
                    description=f"Joy represents {joy_pct:.1f}% of the emotional distribution, showing strong backing.",
                    priority="medium",
                    importance_score=int(round(joy_pct + 10)),
                    confidence="High" if len(joy_posts) >= 3 else "Medium",
                    supporting_metrics=[
                        SupportingMetric(label="Joy Emotion", value=float(round(joy_pct, 1)), unit="%")
                    ],
                    evidence=to_evidence(sorted_joy)
                )
            )

        if neg_emotions_total > 40.0:
            neg_emo_posts = [p for p in posts if p.emotion.lower() in ("anger", "fear", "sadness", "disgust")]
            sorted_neg_emo = sorted(neg_emo_posts, key=lambda p: p.confidence, reverse=True)
            insights.append(
                Insight(
                    id="high_emotional_intensity",
                    category="emotion",
                    title="High emotional intensity",
                    description=f"Negative emotional indicators combined account for {neg_emotions_total:.1f}% of discussion.",
                    priority="high",
                    importance_score=70,
                    confidence="High" if len(neg_emo_posts) >= 3 else "Medium",
                    supporting_metrics=[
                        SupportingMetric(label="Negative Emotions Total", value=float(round(neg_emotions_total, 1)), unit="%")
                    ],
                    evidence=to_evidence(sorted_neg_emo)
                )
            )

        non_neutral_values = [v for k, v in emotion_distribution.items() if k != "Neutral"]
        if non_neutral_values and all(v <= 25.0 for v in non_neutral_values):
            insights.append(
                Insight(
                    id="balanced_emotions",
                    category="emotion",
                    title="Balanced emotional response",
                    description="No single non-neutral emotion dominates, showing a complex, distributed emotional landscape.",
                    priority="low",
                    importance_score=30,
                    confidence="High",
                    supporting_metrics=[],
                    evidence=to_evidence(posts)
                )
            )

        # -------------------------------------------------------------
        # 3. Volume Category
        # -------------------------------------------------------------
        if total_posts < 20:
            insights.append(
                Insight(
                    id="low_volume",
                    category="volume",
                    title="Low Discussion",
                    description=f"Only {total_posts} posts were analyzed, implying a niche topic or limited active public engagement.",
                    priority="low",
                    importance_score=20,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Total Posts", value=total_posts)
                    ],
                    evidence=to_evidence(posts)
                )
            )
        elif 20 <= total_posts < 50:
            insights.append(
                Insight(
                    id="moderate_volume",
                    category="volume",
                    title="Moderate Discussion",
                    description=f"A total of {total_posts} posts were analyzed, representing a stable public stream.",
                    priority="medium",
                    importance_score=45,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Total Posts", value=total_posts)
                    ],
                    evidence=to_evidence(posts)
                )
            )
        elif 50 <= total_posts < 100:
            insights.append(
                Insight(
                    id="high_volume",
                    category="volume",
                    title="High Discussion",
                    description=f"Conversation volume is high with {total_posts} posts captured, reflecting an active public narrative.",
                    priority="high",
                    importance_score=75,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Total Posts", value=total_posts)
                    ],
                    evidence=to_evidence(posts)
                )
            )
        else:
            insights.append(
                Insight(
                    id="very_high_volume",
                    category="volume",
                    title="Very High Discussion",
                    description=f"Massive conversation pool of {total_posts} posts detected, indicating viral interest or major news events.",
                    priority="critical",
                    importance_score=90,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Total Posts", value=total_posts)
                    ],
                    evidence=to_evidence(posts)
                )
            )

        # -------------------------------------------------------------
        # 4. Engagement Category
        # -------------------------------------------------------------
        if avg_likes < 1.0:
            insights.append(
                Insight(
                    id="low_engagement",
                    category="engagement",
                    title="Low Engagement",
                    description=f"Average likes are low at {avg_likes:.1f} per post, suggesting broadcast-heavy discussions.",
                    priority="low",
                    importance_score=25,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Average Likes", value=float(round(avg_likes, 1)))
                    ],
                    evidence=to_evidence(posts)
                )
            )
        elif 1.0 <= avg_likes < 5.0:
            insights.append(
                Insight(
                    id="average_engagement",
                    category="engagement",
                    title="Average Engagement",
                    description=f"Posts receive {avg_likes:.1f} likes on average, indicating normal community traction.",
                    priority="medium",
                    importance_score=50,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Average Likes", value=float(round(avg_likes, 1)))
                    ],
                    evidence=to_evidence(posts)
                )
            )
        elif 5.0 <= avg_likes < 15.0:
            insights.append(
                Insight(
                    id="high_engagement",
                    category="engagement",
                    title="High Engagement",
                    description=f"Audience engagement is strong, averaging {avg_likes:.1f} likes per post.",
                    priority="high",
                    importance_score=78,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Average Likes", value=float(round(avg_likes, 1)))
                    ],
                    evidence=to_evidence(posts)
                )
            )
        else:
            sorted_by_likes = sorted(posts, key=lambda p: p.score, reverse=True)
            insights.append(
                Insight(
                    id="viral_engagement",
                    category="engagement",
                    title="Viral Engagement",
                    description=f"Extremely strong interaction detected, averaging {avg_likes:.1f} likes per post.",
                    priority="critical",
                    importance_score=92,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Average Likes", value=float(round(avg_likes, 1)))
                    ],
                    evidence=to_evidence(sorted_by_likes)
                )
            )

        # -------------------------------------------------------------
        # 5. Consistency Category
        # -------------------------------------------------------------
        # Compute agreement score
        agreement_count = 0
        for p in posts:
            s_lower = p.sentiment.lower()
            e_lower = p.emotion.lower()
            if s_lower == "negative" and e_lower in ("anger", "fear", "sadness", "disgust"):
                agreement_count += 1
            elif s_lower == "positive" and e_lower == "joy":
                agreement_count += 1
            elif s_lower == "neutral" and e_lower == "neutral":
                agreement_count += 1
        
        alignment_ratio = agreement_count / total_posts if total_posts > 0 else 1.0
        avg_conf = sum(p.confidence for p in posts) / total_posts if total_posts > 0 else 1.0
        agreement_score = float(round(alignment_ratio * 60.0 + avg_conf * 40.0))
        
        if agreement_score >= 75:
            consistency_label = "Highly Consistent"
        elif agreement_score >= 50:
            consistency_label = "Moderately Consistent"
        elif agreement_score >= 25:
            consistency_label = "Mixed Signals"
        else:
            consistency_label = "Conflicting Signals"

        insights.append(
            Insight(
                id="consistency_analysis",
                category="consistency",
                title=f"Consistency analysis: {consistency_label}",
                description=f"Consistency evaluation shows {consistency_label} with an agreement score of {agreement_score:.1f}.",
                priority="medium",
                importance_score=int(round(agreement_score)),
                confidence="High",
                supporting_metrics=[
                    SupportingMetric(label="Agreement Score", value=agreement_score)
                ],
                evidence=to_evidence(posts)
            )
        )

        # -------------------------------------------------------------
        # 6. Alert Correlation Category
        # -------------------------------------------------------------
        if alerts:
            alert_ev = alerts[0].evidence
            insights.append(
                Insight(
                    id="alert_correlation",
                    category="alert_correlation",
                    title="Alerts validate public concern",
                    description=f"A total of {len(alerts)} alerts were triggered. The leading warning relates to '{alerts[0].title}'.",
                    priority="high" if any(al.priority.lower() == "high" for al in alerts) else "medium",
                    importance_score=80 if len(alerts) >= 2 else 60,
                    confidence="High",
                    supporting_metrics=[
                        SupportingMetric(label="Active Alerts Count", value=len(alerts))
                    ],
                    evidence=to_evidence(alert_ev) if alert_ev else to_evidence(posts)
                )
            )

        # -------------------------------------------------------------
        # 7. Business Risk Category
        # -------------------------------------------------------------
        risk_posts = [p for p in posts if p.sentiment.lower() == "negative"]
        sorted_risk_posts = sorted(risk_posts, key=lambda p: p.confidence, reverse=True)
        insights.append(
            Insight(
                id="risk_insight",
                category="risk",
                title=f"Business risk rated as {risk_assessment.risk_level}",
                description=f"Calculated risk score is {risk_assessment.risk_score} because: {risk_assessment.reason}",
                priority=risk_assessment.risk_level.lower(),
                importance_score=risk_assessment.risk_score,
                confidence="High",
                supporting_metrics=[
                    SupportingMetric(label="Risk Score", value=risk_assessment.risk_score)
                ],
                evidence=to_evidence(sorted_risk_posts) if sorted_risk_posts else to_evidence(posts)
            )
        )

        # -------------------------------------------------------------
        # Sorting Rules:
        # 1. importanceScore (descending)
        # 2. Priority ("critical" > "high" > "medium" > "low")
        # 3. Confidence ("High" > "Medium" > "Low")
        # 4. Category (alphabetical)
        # -------------------------------------------------------------
        priority_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        confidence_order = {"high": 3, "medium": 2, "low": 1}

        def sort_key(ins: Insight):
            return (
                -ins.importance_score,
                -priority_order.get(ins.priority.lower(), 0),
                -confidence_order.get(ins.confidence.lower(), 0),
                ins.category
            )

        return sorted(insights, key=sort_key)

insight_service = InsightService()
