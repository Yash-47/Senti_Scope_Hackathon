from collections import Counter
from typing import List, Dict, Any
from app.models.response_models import Statistics

class StatisticsService:
    """Service to compute aggregated metrics over processed posts."""

    def calculate_statistics(self, posts: List[Dict[str, Any]]) -> Statistics:
        """Aggregates sentiment percentages, likes averages, comment averages, and authors.

        Args:
            posts (List[Dict[str, Any]]): List of post dictionaries containing sentiment and metadata.

        Returns:
            Statistics: Pydantic Statistics model.
        """
        total_posts = len(posts)
        if total_posts == 0:
            return Statistics(
                total_posts=0,
                positive_percent=0.0,
                neutral_percent=0.0,
                negative_percent=0.0,
                average_comments=0.0,
                average_score=None,
                most_active_subreddit=None,
                average_likes=0.0,
                most_active_author="N/A"
            )

        pos_count = 0
        neg_count = 0
        neu_count = 0
        total_likes = 0
        total_comments = 0
        authors: List[str] = []

        for post in posts:
            sentiment = post.get("sentiment", "Neutral")
            if sentiment == "Positive":
                pos_count += 1
            elif sentiment == "Negative":
                neg_count += 1
            else:
                neu_count += 1

            total_likes += post.get("score", 0)
            total_comments += post.get("comments", 0)
            authors.append(post.get("subreddit", "unknown"))

        # Calculate percentages rounded to 1 decimal place
        positive_percent = round((pos_count / total_posts) * 100, 1)
        negative_percent = round((neg_count / total_posts) * 100, 1)
        neutral_percent = round((neu_count / total_posts) * 100, 1)

        # Averages
        average_likes = round(total_likes / total_posts, 1)
        average_comments = round(total_comments / total_posts, 1)

        # Most active author calculation (using the handle from subreddit key)
        author_counter = Counter(authors)
        most_active_author = author_counter.most_common(1)[0][0] if authors else "unknown"

        return Statistics(
            total_posts=total_posts,
            positive_percent=positive_percent,
            neutral_percent=neutral_percent,
            negative_percent=negative_percent,
            average_comments=average_comments,
            average_score=None,
            most_active_subreddit=None,
            average_likes=average_likes,
            most_active_author=most_active_author
        )

# Reusable singleton instance
statistics_service = StatisticsService()
