from typing import List
from app.models.response_models import Alert

class AlertService:
    """Service to evaluate statistical thresholds and trigger alerts."""

    def evaluate_alerts(
        self,
        total_posts: int,
        positive_percent: float,
        negative_percent: float
    ) -> List[Alert]:
        """Runs validation checks over analysis metrics to identify alerts.

        Args:
            total_posts (int): Total posts analyzed.
            positive_percent (float): Percentage of positive sentiment.
            negative_percent (float): Percentage of negative sentiment.

        Returns:
            List[Alert]: List of triggered Alert models.
        """
        alerts: List[Alert] = []

        # Rule 1: High Negative Sentiment
        if negative_percent > 40.0:
            alerts.append(
                Alert(
                    type="warning",
                    priority="high",
                    title="High Negative Sentiment",
                    description=(
                        f"Negative discussions are highly elevated at {negative_percent}%, "
                        f"signalling a potential increase in user friction or customer complaints."
                    )
                )
            )

        # Rule 2: Strong Positive Trend
        if positive_percent > 70.0:
            alerts.append(
                Alert(
                    type="success",
                    priority="medium",
                    title="Strong Positive Trend",
                    description=(
                        f"Public opinion shows a highly enthusiastic positive trend at {positive_percent}%, "
                        f"indicating favorable reception or viral praise."
                    )
                )
            )

        # Rule 3: Low Data Warning
        if total_posts < 20:
            alerts.append(
                Alert(
                    type="info",
                    priority="low",
                    title="Low Data Warning",
                    description=(
                        f"Only {total_posts} posts were analyzed. Statistical relevance may be "
                        f"diminished due to low conversation volume."
                    )
                )
            )

        return alerts

# Reusable singleton instance
alert_service = AlertService()
