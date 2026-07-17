from typing import Dict, Any
from app.models.response_models import Statistics, RiskAssessment

class RiskService:
    """Service to compute deterministic business risk assessments."""

    def calculate_risk(
        self,
        statistics: Statistics,
        emotion_distribution: Dict[str, float]
    ) -> RiskAssessment:
        total_posts = statistics.total_posts
        neg_pct = statistics.negative_percent
        pos_pct = statistics.positive_percent

        anger_pct = emotion_distribution.get("Anger", 0.0)
        fear_pct = emotion_distribution.get("Fear", 0.0)
        sad_pct = emotion_distribution.get("Sadness", 0.0)
        disgust_pct = emotion_distribution.get("Disgust", 0.0)
        negative_emotions_pct = anger_pct + fear_pct + sad_pct + disgust_pct

        # Compute deterministic risk score (0-100)
        # 1. Negative sentiment weight (up to 50 points)
        neg_score = neg_pct * 0.50
        
        # 2. Anger & Fear emotions weight (up to 40 points)
        emo_score = (anger_pct + fear_pct) * 0.40
        
        # 3. Volume scale weight (up to 10 points)
        vol_score = min(total_posts * 0.20, 10.0)
        
        risk_score = int(round(neg_score + emo_score + vol_score))
        risk_score = max(0, min(100, risk_score))

        # Determine risk level
        if risk_score >= 75:
            risk_level = "Critical"
        elif risk_score >= 50:
            risk_level = "High"
        elif risk_score >= 25:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Generate grounding reason
        if risk_level == "Critical":
            reason = (
                f"Critical risk identified: Negative sentiment is dominant at {neg_pct:.1f}%, "
                f"compounded by elevated anger and fear levels ({anger_pct + fear_pct:.1f}%) "
                f"across a large discussion pool ({total_posts} posts)."
            )
        elif risk_level == "High":
            reason = (
                f"High business risk: Elevated negative discussions ({neg_pct:.1f}%) and "
                f"significant emotional indicators ({anger_pct + fear_pct:.1f}%) suggest active user complaints."
            )
        elif risk_level == "Medium":
            reason = (
                f"Moderate risk observed: Sentiment remains mixed with negative tone at {neg_pct:.1f}%, "
                f"while positive engagement sits at {pos_pct:.1f}%."
            )
        else:
            reason = (
                f"Low risk: Public sentiment is stable with a healthy positive-to-negative ratio "
                f"and low negative emotional triggers."
            )

        supporting_metrics = {
            "negativePercent": float(round(neg_pct, 1)),
            "fearPercent": float(round(fear_pct, 1)),
            "posts": total_posts
        }

        return RiskAssessment(
            risk_level=risk_level,
            risk_score=risk_score,
            reason=reason,
            supporting_metrics=supporting_metrics
        )

risk_service = RiskService()
