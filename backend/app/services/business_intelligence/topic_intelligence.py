from typing import List
from app.models.response_models import PostDetail, TopicIntelligence

class TopicIntelligenceService:
    """Service to compute structured business intelligence for extracted topics."""

    def generate_topic_intelligence(self, topics: List[str], posts: List[PostDetail]) -> List[TopicIntelligence]:
        intelligence_list = []
        
        for topic in topics:
            matching_posts = [p for p in posts if topic.lower() in p.text.lower()]
            if not matching_posts:
                continue

            mentions = len(matching_posts)

            # Determine dominant/average sentiment
            sentiments = [p.sentiment.lower() for p in matching_posts]
            pos_count = sentiments.count("positive")
            neu_count = sentiments.count("neutral")
            neg_count = sentiments.count("negative")
            
            if neg_count >= pos_count and neg_count >= neu_count:
                avg_sentiment = "Negative"
            elif pos_count >= neg_count and pos_count >= neu_count:
                avg_sentiment = "Positive"
            else:
                avg_sentiment = "Neutral"

            # Determine dominant emotion
            emotions = [p.emotion.capitalize() for p in matching_posts]
            emo_counts = {}
            for emo in emotions:
                emo_counts[emo] = emo_counts.get(emo, 0) + 1
            
            # Sort emotions by count descending, prioritizing non-Neutral
            sorted_emotions = sorted(
                emo_counts.items(),
                key=lambda x: (x[1], x[0] != "Neutral"),
                reverse=True
            )
            dominant_emotion = sorted_emotions[0][0] if sorted_emotions else "Neutral"

            # Compute average classifier confidence
            avg_confidence = float(sum(p.confidence for p in matching_posts) / mentions)

            # Compute engagement score (weighted average of likes and comments)
            avg_likes = sum(p.score for p in matching_posts) / mentions
            avg_comments = sum(p.comments for p in matching_posts) / mentions
            engagement_score = float(round(avg_likes * 10.0 + avg_comments * 5.0))

            # Compute priority rating
            if mentions >= 15 and dominant_emotion.lower() in ("anger", "fear", "disgust"):
                priority = "Critical"
            elif mentions >= 10:
                priority = "High"
            elif mentions >= 5:
                priority = "Medium"
            else:
                priority = "Low"

            intelligence_list.append(
                TopicIntelligence(
                    topic=topic,
                    mentions=mentions,
                    average_sentiment=avg_sentiment,
                    dominant_emotion=dominant_emotion,
                    average_confidence=round(avg_confidence, 2),
                    engagement_score=engagement_score,
                    priority=priority
                )
            )

        return intelligence_list

topic_intelligence_service = TopicIntelligenceService()
