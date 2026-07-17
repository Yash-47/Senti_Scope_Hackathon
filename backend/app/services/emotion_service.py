import asyncio
import os
import time
from typing import List, Dict, Any
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from loguru import logger

class EmotionService:
    """Service to predict text emotion using Hugging Face DistilRoBERTa model."""

    def __init__(self) -> None:
        self.model_name = "j-hartmann/emotion-english-distilroberta-base"
        
        # GPU / CPU Auto-detection
        self.device = 0 if torch.cuda.is_available() else -1
        device_name = "cuda" if self.device == 0 else "cpu"
        
        logger.info(f"Model initialization: Loading {self.model_name} on device: {device_name}")
        
        # Load tokenizer and model explicitly to ensure compatibility
        try:
            tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
            
            self.classifier = pipeline(
                "text-classification",
                model=model,
                tokenizer=tokenizer,
                device=self.device
            )
            logger.info("Model successfully loaded.")
            
            # Warm the model with one dummy inference
            logger.info("Warming the emotion model...")
            with torch.inference_mode():
                self.classifier("warmup")
            logger.info("Model warmed successfully.")
            
        except Exception as e:
            logger.error(f"Critical error loading Hugging Face emotion classifier: {str(e)}")
            # Fail with a clear startup error as requested
            raise RuntimeError(f"EmotionService initialization failed: {str(e)}") from e

        # In-memory cache for mapping text -> prediction dict
        self.cache: Dict[str, Dict[str, Any]] = {}
        
        # Store the latest batch distribution metrics
        self.latest_distribution: Dict[str, float] = {
            "Joy": 0.0,
            "Anger": 0.0,
            "Fear": 0.0,
            "Sadness": 0.0,
            "Surprise": 0.0,
            "Disgust": 0.0,
            "Neutral": 0.0
        }

    def get_distribution(self) -> Dict[str, float]:
        """Exposes the latest calculated emotion distribution."""
        return self.latest_distribution

    async def analyze(self, text: str) -> Dict[str, Any]:
        """Analyzes a single text by calling analyze_batch.
        
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
                    "emotion": "Neutral",
                    "confidence": 0.0,
                    "reason": "Invalid or empty input."
                }
                continue
                
            cleaned = text.strip()
            if not cleaned:
                results[idx] = {
                    "emotion": "Neutral",
                    "confidence": 0.0,
                    "reason": "Invalid or empty input."
                }
                continue
                
            if cleaned in self.cache:
                results[idx] = self.cache[cleaned]
                logger.info(f"CACHE HIT - Emotion for text: '{cleaned[:30]}...'")
                continue
                
            uncached_indices.append(idx)
            uncached_texts.append(cleaned)
            logger.info(f"CACHE MISS - Emotion for text: '{cleaned[:30]}...'")

        # 2. Execute Hugging Face pipeline inference on uncached texts
        if uncached_texts:
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
                
                # 3. Postprocess, threshold, and update in-memory cache
                LABEL_MAP = {
                    "joy": "Joy",
                    "anger": "Anger",
                    "fear": "Fear",
                    "sadness": "Sadness",
                    "surprise": "Surprise",
                    "disgust": "Disgust",
                    "neutral": "Neutral"
                }
                
                # Explanation templates
                EXPLANATIONS = {
                    "Joy": "The post expresses happiness or excitement.",
                    "Anger": "The post expresses frustration or dissatisfaction.",
                    "Fear": "The post expresses concern or uncertainty.",
                    "Sadness": "The post expresses disappointment or loss.",
                    "Surprise": "The post expresses an unexpected reaction.",
                    "Disgust": "The post expresses dislike or rejection.",
                    "Neutral": "The post does not express a dominant emotion."
                }
                
                debug_mode = os.getenv("DEBUG_EMOTION", "false").lower() == "true"
                
                for idx, text, pred in zip(uncached_indices, uncached_texts, raw_preds):
                    raw_label = pred.get("label", "neutral")
                    score = float(pred.get("score", 0.0))
                    
                    emotion = LABEL_MAP.get(str(raw_label).lower(), "Neutral")
                    
                    # Apply confidence threshold (0.45) filter
                    if score < 0.45:
                        emotion = "Neutral"
                        reason = "No dominant emotion detected."
                    else:
                        # Determine sentiment for validation
                        sentiment_label = "Neutral"
                        try:
                            from app.services.sentiment_service import sentiment_service
                            sentiment_data = sentiment_service.cache.get(text)
                            if sentiment_data:
                                sentiment_label = sentiment_data.get("sentiment", "Neutral")
                            elif sentiment_service.classifier:
                                with torch.inference_mode():
                                    pred_s = sentiment_service.classifier(text)[0]
                                    raw_s = str(pred_s.get("label", "neutral")).lower()
                                    LABEL_MAP_S = {
                                        "positive": "Positive",
                                        "neutral": "Neutral",
                                        "negative": "Negative",
                                        "label_2": "Positive",
                                        "label_1": "Neutral",
                                        "label_0": "Negative",
                                        "2": "Positive",
                                        "1": "Neutral",
                                        "0": "Negative"
                                    }
                                    sentiment_label = LABEL_MAP_S.get(raw_s, "Neutral")
                        except Exception as ex_s:
                            logger.warning(f"Failed to resolve sentiment for emotion validation: {str(ex_s)}")

                        # Apply validation rules
                        if sentiment_label == "Negative" and emotion == "Joy":
                            if score < 0.60:
                                logger.info(f"Emotion Validation: Converted inconsistent Joy ({score:.3f}) under Negative sentiment to Neutral.")
                                emotion = "Neutral"
                            elif score > 0.85:
                                logger.warning(f"Emotion Validation Warning: High confidence Joy ({score:.3f}) detected in Negative sentiment post: '{text[:60]}...'")
                        elif sentiment_label == "Positive" and emotion == "Fear":
                            if score < 0.60:
                                logger.info(f"Emotion Validation: Converted inconsistent Fear ({score:.3f}) under Positive sentiment to Neutral.")
                                emotion = "Neutral"
                                
                        reason = EXPLANATIONS.get(emotion, "The post does not express a dominant emotion.")
                        
                    prediction = {
                        "emotion": emotion,
                        "confidence": round(score, 3),
                        "reason": reason
                    }
                    
                    # Optionally include raw label for debugging
                    if debug_mode:
                        prediction["raw_label"] = raw_label
                        
                    # Cache the outcome
                    self.cache[text] = prediction
                    results[idx] = prediction
                    
            except Exception as e:
                logger.error(f"Inference error occurred in EmotionService: {str(e)}")
                for idx in uncached_indices:
                    results[idx] = {
                        "emotion": "Neutral",
                        "confidence": 0.0,
                        "reason": "Emotion analysis unavailable."
                    }

        # 4. Compute metrics and report distribution
        total_time = time.perf_counter() - start_time
        num_posts = len(texts)
        avg_time = total_time / num_posts if num_posts > 0 else 0.0
        posts_per_sec = num_posts / total_time if total_time > 0 else 0.0
        
        valid_results = [r for r in results if r is not None]
        avg_confidence = sum(r["confidence"] for r in valid_results) / len(valid_results) if valid_results else 0.0
        
        # Calculate emotion distribution percentages for this batch
        counts = {
            "Joy": 0, "Anger": 0, "Fear": 0, "Sadness": 0, "Surprise": 0, "Disgust": 0, "Neutral": 0
        }
        for r in valid_results:
            emo = r["emotion"]
            if emo in counts:
                counts[emo] += 1
            else:
                counts["Neutral"] += 1
                
        total_valid = len(valid_results)
        if total_valid > 0:
            for emo in counts:
                self.latest_distribution[emo] = round((counts[emo] / total_valid) * 100, 1)
        else:
            for emo in self.latest_distribution:
                self.latest_distribution[emo] = 0.0

        logger.info(f"Model loaded: {self.model_name} | Device: {'cuda' if self.device == 0 else 'cpu'}")
        logger.info(f"Total inference time: {total_time:.4f}s | Average inference time: {avg_time:.4f}s | Throughput: {posts_per_sec:.2f} posts/sec")
        logger.info(f"Number of posts: {num_posts} | Average confidence: {avg_confidence:.3f}")
        logger.info(f"Emotion distribution: {self.latest_distribution}")

        return results

# Reusable singleton instance
emotion_service = EmotionService()
