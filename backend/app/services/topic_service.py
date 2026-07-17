import asyncio
import hashlib
import os
import re
import time
from collections import Counter
from typing import List, Dict, Any, Tuple
import torch
from keybert import KeyBERT
from loguru import logger
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

from app.utils.text_cleaner import clean_text

class TopicService:
    """Service to extract trending topics/keywords using a local KeyBERT engine."""

    def __init__(self) -> None:
        self.model_name = "KeyBERT"
        self.embedding_model = "all-MiniLM-L6-v2"
        
        # GPU / CPU Auto-detection
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        logger.info(f"Model initialization: Loading {self.model_name} with {self.embedding_model} on device: {self.device}")
        
        try:
            # Initialize KeyBERT
            self.model = KeyBERT(model=self.embedding_model)
            logger.info("Startup success: KeyBERT model loaded.")
            
            # Warm up the embedding model
            logger.info("Warming the topic extraction model...")
            self.model.extract_keywords("warmup text model testing", keyphrase_ngram_range=(1, 1), stop_words='english')
            logger.info("Model warmed successfully.")
            
        except Exception as e:
            logger.error(f"Critical error loading KeyBERT: {str(e)}")
            raise RuntimeError(f"TopicService initialization failed: {str(e)}") from e

        # Custom domain stopword list
        self.custom_stopwords = {
            "agreement", "announced", "today", "yesterday", "thing", "things", "stuff", "someone", "something",
            "anything", "everything", "drawback", "drawbacks", "issue", "issues", "problem", "problems", "good", "bad", "great", "nice",
            "cool", "okay", "really", "actually", "basically", "new", "latest", "update", "breaking", "news",
            "report", "reported", "says", "said", "according", "using", "used", "make", "made", "get", "got",
            "going", "look", "looking", "see", "seen", "post", "posts", "user", "users", "week", "month",
            "year", "day", "days", "time", "times", "like", "share", "shares", "morn", "wild", "wilds",
            "opinion", "opinions", "wankpanzer", "Rosemary", "pedophileoftheunitedstates", "etc"
        }
        
        # Combine English stopwords with custom domain stopwords
        self.stopwords = list(ENGLISH_STOP_WORDS.union(self.custom_stopwords))

        # Proper Nouns casing normalization mapping
        self.proper_nouns_map = {
            "tesla": "Tesla",
            "openai": "OpenAI",
            "samsung": "Samsung",
            "apple": "Apple",
            "google": "Google",
            "microsoft": "Microsoft",
            "meta": "Meta",
            "nvidia": "NVIDIA",
            "amd": "AMD",
            "intel": "Intel",
            "chatgpt": "ChatGPT",
            "claude": "Claude",
            "gemini": "Gemini",
            "robotaxi": "Robotaxi",
            "starlink": "Starlink",
            "iphone": "iPhone",
            "fsd": "FSD",
            "autopilot": "Autopilot",
            "cybercab": "Cybercab",
            "model y": "Model Y",
            "model 3": "Model 3",
            "model s": "Model S",
            "model x": "Model X",
            "megapack": "Megapack",
            "republicans": "Republican Party",
            "republican": "Republican Party",
            "maga": "MAGA",
            "trump": "Donald Trump"
        }

        # In-memory cache: SHA256(batch_texts) -> extraction_dict
        self.cache: Dict[str, Dict[str, Any]] = {}
        
        # Store the latest batch results
        self.latest_results: Dict[str, Any] = {
            "overall_topics": [], "positive_topics": [], "negative_topics": [], "neutral_topics": [],
            "top_phrases": [], "trending_keywords": [], "top_complaint": None, "top_praise": None
        }

    def get_latest_results(self) -> Dict[str, Any]:
        """Exposes the latest calculated topics batch results."""
        return self.latest_results

    def _clean_text_for_topics(self, text: str) -> str:
        """Cleans post content by removing URLs, HTML, mentions, hashtags, and single-char tokens."""
        if not text:
            return ""
            
        # Remove HTML tags & entities
        text = re.sub(r"<[^>]*>", "", text)
        
        # Remove mentions (@username)
        text = re.sub(r"@\w+(\.\w+)*", "", text)
        
        # Remove hashtags (#tag)
        text = re.sub(r"#\w+", "", text)
        
        # Standard clean_text utility (URLs, markdown, punctuation, duplicate whitespace)
        cleaned = clean_text(text)
        
        # Normalization: normalize duplicate whitespaces and strip
        tokens = [t for t in cleaned.split() if len(t) > 1]
        
        return " ".join(tokens)

    def _is_valid_topic(self, topic: str) -> bool:
        """Enforces token filtering rules to remove noisy keywords."""
        t = topic.strip().lower()
        if not t:
            return False
            
        # Proper nouns are always valid
        if t in self.proper_nouns_map:
            return True
            
        # Check domain stopwords
        if t in self.custom_stopwords:
            return False
            
        # Reject if longer than 20 characters
        if len(topic) > 20:
            return False
            
        # Ignore shorter than 3 characters (unless proper noun)
        if len(t) < 3:
            return False
            
        # Ignore if contains only digits or punctuation
        if re.match(r"^[\d\s.,\/#!$%\^&\*;:{}=\-_`~()]+$", t):
            return False
            
        # Ignore version identifiers (like v2, o1, v12)
        if re.match(r"^v?\d+$", t) or re.match(r"^[a-z]\d+$", t):
            return False
            
        # Ignore isolated uppercase abbreviations with no context
        if topic.isupper() and len(topic) < 4:
            if t not in self.proper_nouns_map:
                return False
                
        return True

    def _categorize_topic(self, keyword: str) -> str:
        """Expanded rule-based categorization mapping keywords to business categories."""
        kw = keyword.lower()
        
        ai_keywords = {"ai", "openai", "chatgpt", "claude", "gemini", "llm", "deep learning", "neural network", "gpt"}
        company_keywords = {"tesla", "samsung", "apple", "google", "microsoft", "meta", "nvidia", "amd", "intel", "starlink", "openai"}
        issue_keywords = {"bug", "error", "crash", "warn", "fail", "broken", "issue", "problem", "leak", "drain", "heat", "slow", "wrong", "expensive", "bad", "polarization", "limits"}
        finance_keywords = {"stock", "price", "cost", "earnings", "quarter", "revenue", "dollar", "trillion", "billion", "payment", "buy", "sell", "capital", "worth", "rates", "inflation", "rally", "subscribers", "pricing"}
        business_keywords = {"company", "firm", "market", "competitor", "business", "deal", "merge", "acquisition", "shares", "employee"}
        technology_keywords = {"robotaxi", "technology", "software", "update", "code", "tech", "data", "processing", "intelligence", "cybercab", "failing", "autopilot", "fsd"}
        feature_keywords = {"autopilot", "fsd", "preconditioning", "camera", "quality", "charger", "charging", "screen", "display", "interior", "cabin", "bezel", "oled", "speakers"}
        product_keywords = {"car", "phone", "device", "battery", "tesla", "galaxy", "iphone", "samsung", "ev", "megapack", "vehicle", "tv", "watch"}
        event_keywords = {"launch", "release", "announcement", "concert", "meeting", "event", "show", "hearing", "debate"}
        people_keywords = {"musk", "elon", "butler", "martha", "michael", "candidate", "trump"}
        
        if any(k in kw for k in ai_keywords):
            return "AI"
        if any(k in kw for k in company_keywords):
            return "Company"
        if any(k in kw for k in issue_keywords):
            return "Issue"
        if any(k in kw for k in finance_keywords):
            return "Finance"
        if any(k in kw for k in business_keywords):
            return "Business"
        if any(k in kw for k in technology_keywords):
            return "Technology"
        if any(k in kw for k in feature_keywords):
            return "Feature"
        if any(k in kw for k in product_keywords):
            return "Product"
        if any(k in kw for k in event_keywords):
            return "Event"
        if any(k in kw for k in people_keywords):
            return "People"
            
        return "Product"

    def _deduplicate_and_rank(self, raw_keywords: List[Tuple[str, float]], valid_texts: List[str]) -> List[Dict[str, Any]]:
        """Merges similar concepts, filters out noisy tokens/low-quality topics, and ranks by Trending Score."""
        if not raw_keywords:
            return []
            
        # 1. Clean extracted raw terms
        candidates = []
        for term, score in raw_keywords:
            term_str = str(term).strip()
            if not self._is_valid_topic(term_str):
                continue
                
            term_lower = term_str.lower()
            
            # Enforce concept merges
            merged_to_root = False
            for root_key, root_val in {
                "battery": "Battery",
                "camera": "Camera",
                "software": "Software",
                "charging": "Charging"
            }.items():
                if root_key in term_lower:
                    term_str = root_val
                    merged_to_root = True
                    break
                    
            if not merged_to_root:
                # Enforce proper noun normalization
                if term_lower in self.proper_nouns_map:
                    term_str = self.proper_nouns_map[term_lower]
                else:
                    # Title case other terms
                    term_str = " ".join(w.capitalize() for w in term_str.split())
                    
            candidates.append({
                "keyword": term_str,
                "score": float(score)
            })

        if not candidates:
            return []

        # 2. Count term frequencies
        term_freqs = {}
        for item in candidates:
            kw_lower = item["keyword"].lower()
            freq = sum(1 for post in valid_texts if kw_lower in post.lower())
            term_freqs[kw_lower] = freq

        # 3. Deduplicate overlapping terms (sort by length ascending)
        sorted_candidates = sorted(candidates, key=lambda x: len(x["keyword"].lower()))
        merged: List[Dict[str, Any]] = []

        for item in sorted_candidates:
            kw_lower = item["keyword"].lower()
            item_freq = term_freqs.get(kw_lower, 1)
            
            found = False
            for m in merged:
                m_kw = m["keyword"].lower()
                if m_kw in kw_lower or kw_lower in m_kw:
                    m["frequency"] += item_freq
                    m["score"] = max(m["score"], item["score"])
                    found = True
                    break
            if not found:
                item["frequency"] = item_freq
                merged.append(item)

        # 4. Quality Filter: Reject keywords appearing only once and with score < 0.30, unless they are named entities
        filtered_merged = []
        for m in merged:
            kw_lower = m["keyword"].lower()
            is_named_entity = kw_lower in self.proper_nouns_map
            if m["frequency"] <= 1 and m["score"] < 0.30 and not is_named_entity:
                logger.info(f"Quality Filter REJECTED topic: '{m['keyword']}' (freq: {m['frequency']}, score: {m['score']:.3f})")
                continue
            filtered_merged.append(m)

        if not filtered_merged:
            return []

        # 5. Normalize relevance and calculate Trending Score
        max_relevance = max(m["score"] for m in filtered_merged)
        for m in filtered_merged:
            normalized_relevance = m["score"] / max_relevance if max_relevance > 0 else 0.0
            
            # Trending Score = 0.6 * frequency + 0.4 * normalized relevance
            m["trending_score"] = round((0.6 * m["frequency"]) + (0.4 * normalized_relevance), 3)
            m["category"] = self._categorize_topic(m["keyword"])

        # Sort topics descending by Trending Score
        ranked_topics = sorted(filtered_merged, key=lambda x: x["trending_score"], reverse=True)
        
        # Format output structures
        formatted = []
        for t in ranked_topics:
            formatted.append({
                "keyword": t["keyword"],
                "category": t["category"],
                "score": t["score"]
            })
            
        return formatted

    async def extract(self, texts: List[str]) -> List[str]:
        """Backward-compatible extraction endpoint for pipeline_service.py.
        
        Returns the top 10 overall keywords as a list of strings.
        """
        try:
            posts = [{"text": t, "sentiment": "Neutral"} for t in texts]
            results = await self.extract_topics_batch(posts)
            overall = results.get("overall_topics", [])
            return [t["keyword"] for t in overall[:10]]
        except Exception as e:
            logger.error(f"Error during legacy extract(): {str(e)}")
            return []

    async def extract_topics(self, text: str) -> Dict[str, Any]:
        """Extracts topics for a single text post."""
        return await self.extract_topics_batch([{"text": text, "sentiment": "Neutral"}])

    async def extract_topics_batch(self, posts: List[Any]) -> Dict[str, Any]:
        """Extracts and categorizes topics for a collection of posts, separated by sentiment."""
        start_time = time.perf_counter()
        
        # 1. Standardize and preprocess inputs
        valid_posts = []
        valid_cleaned_texts = []
        
        for post in posts:
            if isinstance(post, dict):
                text = post.get("text", "")
                sentiment = post.get("sentiment", "Neutral")
            else:
                text = getattr(post, "text", "") or getattr(post, "body", "") or ""
                sentiment = getattr(post, "sentiment", "Neutral")
                
            cleaned = self._clean_text_for_topics(text)
            if cleaned:
                valid_posts.append({"text": cleaned, "sentiment": sentiment})
                valid_cleaned_texts.append(cleaned)

        if not valid_posts:
            logger.warning("No valid text posts left after cleaning.")
            return {
                "overall_topics": [], "positive_topics": [], "negative_topics": [], "neutral_topics": [],
                "top_phrases": [], "trending_keywords": [], "top_complaint": None, "top_praise": None
            }

        # 2. Check Cache
        batch_hash = hashlib.sha256(" ".join(valid_cleaned_texts).encode("utf-8")).hexdigest()
        if batch_hash in self.cache:
            logger.info("CACHE HIT - Topic extraction batch.")
            self.latest_results = self.cache[batch_hash]
            return self.cache[batch_hash]
        logger.info("CACHE MISS - Topic extraction batch.")

        out_dict = {
            "overall_topics": [], "positive_topics": [], "negative_topics": [], "neutral_topics": [],
            "top_phrases": [], "trending_keywords": [], "top_complaint": None, "top_praise": None
        }

        try:
            # 3. Extract overall keywords & keyphrases
            def run_keybert_extraction(joined_txt):
                kws = self.model.extract_keywords(
                    joined_txt,
                    keyphrase_ngram_range=(1, 1),
                    stop_words=self.stopwords,
                    use_mmr=True,
                    diversity=0.3,
                    top_n=25
                )
                phrases = self.model.extract_keywords(
                    joined_txt,
                    keyphrase_ngram_range=(1, 3),
                    stop_words=self.stopwords,
                    use_mmr=True,
                    diversity=0.3,
                    top_n=15
                )
                return kws, phrases

            overall_txt = " ".join(valid_cleaned_texts)
            overall_kws, overall_phrases = await asyncio.to_thread(run_keybert_extraction, overall_txt)

            # Deduplicate and rank overall
            overall_ranked = self._deduplicate_and_rank(overall_kws, valid_cleaned_texts)
            out_dict["overall_topics"] = overall_ranked[:10]
            out_dict["trending_keywords"] = overall_ranked[:10]

            # Deduplicate and rank top phrases
            phrases_ranked = self._deduplicate_and_rank(overall_phrases, valid_cleaned_texts)
            out_dict["top_phrases"] = phrases_ranked[:5]

            # 4. Extract sentiment-grouped topics
            for sentiment_name, key in [("Positive", "positive_topics"), ("Negative", "negative_topics"), ("Neutral", "neutral_topics")]:
                group_posts = [p["text"] for p in valid_posts if p["sentiment"] == sentiment_name]
                if group_posts:
                    group_txt = " ".join(group_posts)
                    group_kws, _ = await asyncio.to_thread(run_keybert_extraction, group_txt)
                    out_dict[key] = self._deduplicate_and_rank(group_kws, group_posts)[:5]

            # 5. Determine Top Praise & Complaint with Representative Post Evidence
            if out_dict["positive_topics"]:
                top_p = out_dict["positive_topics"][0]
                kw = top_p["keyword"].lower()
                
                # Fetch up to 3 original posts containing the keyword
                praise_examples = []
                for post in posts:
                    txt = post.get("text", "") if isinstance(post, dict) else getattr(post, "text", "") or getattr(post, "body", "") or ""
                    if kw in txt.lower():
                        praise_examples.append(txt.strip())
                        if len(praise_examples) == 3:
                            break
                            
                out_dict["top_praise"] = {
                    "keyword": top_p["keyword"],
                    "category": top_p["category"],
                    "examples": praise_examples
                }
            else:
                out_dict["top_praise"] = {"keyword": "N/A", "category": "Product", "examples": []}

            if out_dict["negative_topics"]:
                top_c = out_dict["negative_topics"][0]
                kw = top_c["keyword"].lower()
                
                # Fetch up to 3 original posts containing the keyword
                complaint_examples = []
                for post in posts:
                    txt = post.get("text", "") if isinstance(post, dict) else getattr(post, "text", "") or getattr(post, "body", "") or ""
                    if kw in txt.lower():
                        complaint_examples.append(txt.strip())
                        if len(complaint_examples) == 3:
                            break
                            
                out_dict["top_complaint"] = {
                    "keyword": top_c["keyword"],
                    "category": top_c["category"],
                    "examples": complaint_examples
                }
            else:
                out_dict["top_complaint"] = {"keyword": "N/A", "category": "Issue", "examples": []}

            # Save in cache & local attribute
            self.cache[batch_hash] = out_dict
            self.latest_results = out_dict

        except Exception as e:
            logger.error(f"Inference error during KeyBERT extraction: {str(e)}")

        # Performance metrics logging
        total_time = time.perf_counter() - start_time
        num_posts = len(posts)
        avg_time = total_time / num_posts if num_posts > 0 else 0.0
        pps = num_posts / total_time if total_time > 0 else 0.0
        total_kws = len(out_dict["overall_topics"])

        logger.info(f"KeyBERT extraction completed. Total time: {total_time:.4f}s | Avg time: {avg_time:.4f}s | PPS: {pps:.2f} posts/sec")
        logger.info(f"Number of posts: {num_posts} | Number of keywords: {total_kws}")
        top_kws = [t['keyword'] for t in out_dict["overall_topics"][:5]]
        logger.info(f"Top extracted keywords: {top_kws}")
        logger.info(f"Top praise: {out_dict['top_praise']['keyword']} | Top complaint: {out_dict['top_complaint']['keyword']}")

        return out_dict

# Reusable singleton instance
topic_service = TopicService()
