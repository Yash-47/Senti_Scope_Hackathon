import asyncio
import time
from typing import List, Dict, Any
import torch
from transformers import pipeline
from loguru import logger

class SentimentService:
    """Service to predict text sentiment using Hugging Face RoBERTa model."""

    def __init__(self) -> None:
        self.model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
        
        # GPU / CPU Auto-detection
        self.device = 0 if torch.cuda.is_available() else -1
        device_name = "cuda" if self.device == 0 else "cpu"
        
        logger.info(f"Model initialization: Loading {self.model_name} on device: {device_name}")
        
        try:
            self.classifier = pipeline(
                "sentiment-analysis",
                model=self.model_name,
                device=self.device
            )
            logger.info("Model loaded successfully.")
            
            # Warm the model with one dummy inference
            logger.info("Warming the sentiment model...")
            with torch.inference_mode():
                self.classifier("warmup")
            logger.info("Model warmed successfully.")
            
        except Exception as e:
            logger.error(f"Failed to load or warm the Hugging Face sentiment pipeline: {str(e)}")
            self.classifier = None

        # Small in-memory cache for mapping text -> prediction dict
        self.cache: Dict[str, Dict[str, Any]] = {}

    async def analyze(self, text: str) -> Dict[str, Any]:
        """Analyzes a single text by delegating to analyze_batch.
        
        Maintains backward compatibility with pipeline_service.py.
        """
        results = await self.analyze_batch([text])
        return results[0]

    async def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        """Analyzes a batch of texts using the loaded Hugging Face model.
        
        Leverages GPU if available, caches results, and runs in a thread pool to avoid blocking.
        """
        start_time = time.perf_counter()
        
        results: List[Dict[str, Any]] = [None] * len(texts)
        uncached_indices: List[int] = []
        uncached_texts: List[str] = []
        
        # 1. Validate inputs and lookup cache
        for idx, text in enumerate(texts):
            if text is None:
                results[idx] = {
                    "sentiment": "Neutral",
                    "confidence": 0.0,
                    "reason": "Invalid or empty input text."
                }
                continue
                
            cleaned = text.strip()
            if not cleaned:
                results[idx] = {
                    "sentiment": "Neutral",
                    "confidence": 0.0,
                    "reason": "Invalid or empty input text."
                }
                continue
                
            if cleaned in self.cache:
                results[idx] = self.cache[cleaned]
                logger.info(f"CACHE HIT - Sentiment for text: '{cleaned[:30]}...'")
                continue
                
            uncached_indices.append(idx)
            uncached_texts.append(cleaned)
            logger.info(f"CACHE MISS - Sentiment for text: '{cleaned[:30]}...'")

        # 2. Execute Hugging Face pipeline inference on uncached texts
        if uncached_texts:
            if not self.classifier:
                logger.error("Hugging Face classifier pipeline is not loaded.")
                for idx in uncached_indices:
                    results[idx] = {
                        "sentiment": "Neutral",
                        "confidence": 0.0,
                        "reason": "Sentiment analysis unavailable."
                    }
            else:
                batch_size = 16
                raw_preds = []
                
                try:
                    # Run the synchronous inference in a threadpool to prevent FastAPI thread-blocking
                    def run_inference():
                        preds = []
                        for i in range(0, len(uncached_texts), batch_size):
                            batch = uncached_texts[i:i + batch_size]
                            with torch.inference_mode():
                                preds.extend(self.classifier(batch))
                        return preds
                        
                    raw_preds = await asyncio.to_thread(run_inference)
                    
                    # 3. Postprocess and update in-memory cache
                    LABEL_MAP = {
                        "positive": "Positive",
                        "neutral": "Neutral",
                        "negative": "Negative",
                        "LABEL_2": "Positive",
                        "LABEL_1": "Neutral",
                        "LABEL_0": "Negative",
                        "2": "Positive",
                        "1": "Neutral",
                        "0": "Negative"
                    }
                    
                    for idx, text, pred in zip(uncached_indices, uncached_texts, raw_preds):
                        raw_label = pred.get("label", "neutral")
                        score = float(pred.get("score", 0.0))
                        
                        sentiment = LABEL_MAP.get(str(raw_label).lower(), "Neutral")
                        
                        # Generate rule-based explanation templates
                        if sentiment == "Positive":
                            reason = "Positive sentiment detected with high confidence." if score > 0.8 else "Positive sentiment detected with moderate confidence."
                        elif sentiment == "Negative":
                            reason = "Negative sentiment detected with high confidence." if score > 0.8 else "Negative sentiment detected with moderate confidence."
                        else:
                            reason = "Neutral or objective tone detected."
                            
                        prediction = {
                            "sentiment": sentiment,
                            "confidence": round(score, 3),
                            "reason": reason
                        }
                        
                        # Cache the outcome
                        self.cache[text] = prediction
                        results[idx] = prediction
                        
                except Exception as e:
                    logger.error(f"Inference error occurred: {str(e)}")
                    # Return neutral fallback for all failed runs
                    for idx in uncached_indices:
                        results[idx] = {
                            "sentiment": "Neutral",
                            "confidence": 0.0,
                            "reason": "Sentiment analysis unavailable."
                        }

        # 4. Compute metrics and report
        total_time = time.perf_counter() - start_time
        num_posts = len(texts)
        avg_time = total_time / num_posts if num_posts > 0 else 0.0
        posts_per_sec = num_posts / total_time if total_time > 0 else 0.0
        
        valid_results = [r for r in results if r is not None]
        avg_confidence = sum(r["confidence"] for r in valid_results) / len(valid_results) if valid_results else 0.0
        
        pos_pct = 0.0
        neu_pct = 0.0
        neg_pct = 0.0
        
        if valid_results:
            pos_count = sum(1 for r in valid_results if r["sentiment"] == "Positive")
            neu_count = sum(1 for r in valid_results if r["sentiment"] == "Neutral")
            neg_count = sum(1 for r in valid_results if r["sentiment"] == "Negative")
            pos_pct = (pos_count / len(valid_results)) * 100
            neu_pct = (neu_count / len(valid_results)) * 100
            neg_pct = (neg_count / len(valid_results)) * 100

        logger.info(f"Model loaded: {self.model_name} | Device: {'cuda' if self.device == 0 else 'cpu'}")
        logger.info(f"Total inference time: {total_time:.4f}s | Average inference time: {avg_time:.4f}s | Posts per second: {posts_per_sec:.2f}")
        logger.info(f"Number of posts: {num_posts} | Average confidence: {avg_confidence:.3f}")
        logger.info(f"Positive %: {pos_pct:.1f}% | Neutral %: {neu_pct:.1f}% | Negative %: {neg_pct:.1f}%")

        # Dynamically pass batch metrics to statistics_service
        try:
            from app.services.statistics_service import statistics_service
            statistics_service.average_confidence = avg_confidence
            statistics_service.positive_percent = pos_pct
            statistics_service.neutral_percent = neu_pct
            statistics_service.negative_percent = neg_pct
        except Exception as e:
            logger.warning(f"Failed to assign metrics to statistics_service: {str(e)}")

        return results

# Reusable singleton instance
sentiment_service = SentimentService()
