import asyncio
import datetime
import os
import time
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from atproto import Client
from atproto.exceptions import UnauthorizedError, NetworkError, InvokeTimeoutError, RequestErrorBase
from loguru import logger
from pydantic import BaseModel, Field

from app.exceptions.custom_exceptions import BlueskyUnavailable, Timeout, UnexpectedError
from app.services.cache_service import cache_service

class BlueskyPost(BaseModel):
    """Model mapping Bluesky record parameters to generic post metrics."""
    text: str = Field(default="")
    author: str = Field(default="", description="The displayName of the author")
    handle: str = Field(default="", description="The username handle of the author")
    display_name: str = Field(default="", alias="displayName")
    like_count: int = Field(default=0, alias="likeCount")
    repost_count: int = Field(default=0, alias="repostCount")
    reply_count: int = Field(default=0, alias="replyCount")
    indexed_at: str = Field(..., alias="indexedAt")
    uri: str = Field(..., description="The AT protocol URI of the post.")

    # Downstream compatibility fields mapping to legacy Reddit attributes
    title: str = ""
    body: str = ""
    subreddit: str = ""
    score: int = 0
    comments: int = 0
    created_utc: float = 0.0
    permalink: str = ""

    model_config = {
        "populate_by_name": True
    }

class BlueskyService:
    """Service to query posts from the official Bluesky SDK."""

    def __init__(self) -> None:
        self.client = Client()
        self._last_cursor: Optional[str] = None
        self._authenticate()

    def _authenticate(self) -> None:
        """Helper to run the initial authentication."""
        load_dotenv()
        handle = os.getenv("BSKY_HANDLE")
        password = os.getenv("BSKY_APP_PASSWORD")
        if not handle or not password:
            logger.error("SDK login failure: BSKY_HANDLE or BSKY_APP_PASSWORD not set in environment.")
            raise BlueskyUnavailable("Bluesky credentials not configured.")
        
        try:
            logger.info(f"Attempting Bluesky SDK login with handle: {handle}")
            start_time = time.perf_counter()
            self.client.login(handle, password)
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.info(f"SDK login success in {duration_ms:.2f}ms")
        except Exception as e:
            logger.error(f"SDK login failure: {str(e)}")
            raise BlueskyUnavailable(f"Bluesky login failed: {str(e)}")

    def ensure_authenticated(self) -> None:
        """Verifies if the client has a session, and if not, authenticates."""
        if not self.client.me:
            logger.info("Session not active/expired. Re-authenticating...")
            self._authenticate()

    async def fetch_posts(self, keyword: str, limit: int = 50, sort: str = "latest", cursor: Optional[str] = None) -> List[BlueskyPost]:
        """Queries the Bluesky public search index using the SDK with retry logic."""
        # Check cache
        cache_key = f"bluesky_posts_{keyword}"
        cached = cache_service.get(cache_key)
        if cached is not None:
            logger.info(f"CACHE HIT - Bluesky posts for keyword: '{keyword}'")
            return cached
        logger.info(f"CACHE MISS - Bluesky posts for keyword: '{keyword}'")

        # Ensure active session
        try:
            await asyncio.to_thread(self.ensure_authenticated)
        except Exception as e:
            raise BlueskyUnavailable(f"Failed to authenticate: {str(e)}")

        # Determine correct search API method
        search_func = None
        feed_ns = getattr(self.client.app.bsky, "feed", None)
        if feed_ns:
            for name in ["search_posts", "searchPosts"]:
                if hasattr(feed_ns, name):
                    search_func = getattr(feed_ns, name)
                    break
        
        if not search_func:
            logger.error("No valid search method found on SDK feed namespace.")
            raise UnexpectedError("Bluesky SDK does not expose a compatible search method.")

        search_limit = min(limit, 100)
        params = {
            "q": keyword,
            "limit": search_limit,
            "sort": sort
        }
        if cursor:
            params["cursor"] = cursor

        logger.info(f"Searching Bluesky for keyword: '{keyword}' (limit: {search_limit}, sort: {sort})")

        backoffs = [2, 4, 8]
        max_attempts = len(backoffs) + 1
        last_exception = None

        for attempt in range(1, max_attempts + 1):
            try:
                start_time = time.perf_counter()
                
                # Execute synchronous SDK call in thread to avoid event loop block
                response = await asyncio.to_thread(search_func, params=params)
                
                duration_ms = (time.perf_counter() - start_time) * 1000
                logger.info(f"Bluesky SDK search response time: {duration_ms:.2f}ms (Attempt {attempt})")

                # Store the cursor for future pagination
                self._last_cursor = getattr(response, "cursor", None)

                posts = self._parse_search_results(getattr(response, "posts", []))
                logger.info(f"Successfully fetched {len(posts)} posts from Bluesky for query '{keyword}'")
                
                # Cache final parsed posts
                cache_service.set(cache_key, posts)
                return posts

            except UnauthorizedError as ue:
                logger.warning(f"Unauthorized/Session expired on attempt {attempt}: {str(ue)}")
                last_exception = BlueskyUnavailable("Bluesky search service unauthorized. Check credentials.")
                try:
                    await asyncio.to_thread(self._authenticate)
                except Exception:
                    break
            except InvokeTimeoutError as ite:
                logger.warning(f"Timeout on attempt {attempt}: {str(ite)}")
                last_exception = Timeout("Connection to Bluesky search service timed out.")
            except NetworkError as ne:
                logger.warning(f"Network error on attempt {attempt}: {str(ne)}")
                last_exception = BlueskyUnavailable("Bluesky search index is currently unreachable.")
            except RequestErrorBase as re:
                status_code = re.response.status_code if re.response else 500
                logger.warning(f"Request error (Status {status_code}) on attempt {attempt}: {str(re)}")
                if status_code == 429:
                    last_exception = BlueskyUnavailable("Bluesky rate limit exceeded.")
                else:
                    last_exception = BlueskyUnavailable(f"Bluesky search index returned error status: {status_code}")
            except Exception as e:
                logger.exception(f"Unexpected exception on attempt {attempt}: {str(e)}")
                last_exception = UnexpectedError("An unexpected error occurred during communicate with Bluesky.")

            if attempt < max_attempts:
                wait_time = backoffs[attempt - 1]
                logger.info(f"Retrying Bluesky search in {wait_time}s...")
                await asyncio.sleep(wait_time)

        if last_exception:
            raise last_exception
        raise UnexpectedError("Failed to query Bluesky after multiple retry attempts.")

    def _parse_search_results(self, raw_posts: list) -> List[BlueskyPost]:
        """Parses the SDK PostView objects into generic post metrics."""
        parsed_posts: List[BlueskyPost] = []

        for p in raw_posts:
            try:
                uri = getattr(p, "uri", "")
                author_data = getattr(p, "author", None)
                handle = getattr(author_data, "handle", "unknown.bsky.social")
                display_name = getattr(author_data, "display_name", "") or getattr(author_data, "displayName", "") or handle

                record_data = getattr(p, "record", None)
                text = getattr(record_data, "text", "")
                created_at = getattr(record_data, "created_at", "") or getattr(record_data, "createdAt", "") or getattr(p, "indexed_at", "") or getattr(p, "indexedAt", "")

                like_count = getattr(p, "like_count", 0) or getattr(p, "likeCount", 0) or 0
                repost_count = getattr(p, "repost_count", 0) or getattr(p, "repostCount", 0) or 0
                reply_count = getattr(p, "reply_count", 0) or getattr(p, "replyCount", 0) or 0
                indexed_at = getattr(p, "indexed_at", "") or getattr(p, "indexedAt", "") or created_at

                if not text or not uri:
                    continue

                # Compute Unix created_utc
                created_utc = 0.0
                if indexed_at:
                    try:
                        iso_str = indexed_at.replace("Z", "+00:00")
                        dt = datetime.datetime.fromisoformat(iso_str)
                        created_utc = dt.timestamp()
                    except Exception:
                        created_utc = datetime.datetime.now(datetime.timezone.utc).timestamp()

                # Generate public web permalink
                post_id = uri.split("/")[-1] if "/" in uri else uri
                permalink = f"https://bsky.app/profile/{handle}/post/{post_id}"

                post = BlueskyPost(
                    text=text,
                    author=display_name,
                    handle=handle,
                    displayName=display_name,
                    likeCount=like_count,
                    repostCount=repost_count,
                    replyCount=reply_count,
                    indexedAt=indexed_at,
                    uri=uri,
                    
                    # Compatibility fields
                    title="",
                    body=text,
                    subreddit=f"@{handle}",
                    score=like_count,
                    comments=reply_count,
                    created_utc=created_utc,
                    permalink=permalink
                )
                parsed_posts.append(post)
            except Exception as e:
                logger.warning(f"Skipping malformed Bluesky post parsing element: {str(e)}")
                continue

        return parsed_posts

# Reusable singleton instance
bluesky_service = BlueskyService()
