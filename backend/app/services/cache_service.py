from typing import Any, Optional
from cachetools import TTLCache
from app.core.config import settings
from loguru import logger

class CacheService:
    """In-memory TTL cache service utilizing cachetools."""
    
    def __init__(self) -> None:
        # Standard TTLCache keeping up to 1000 queries cached with an env-driven TTL
        self._cache: TTLCache = TTLCache(maxsize=1000, ttl=settings.CACHE_TTL)
        logger.info(f"CacheService initialized with TTL of {settings.CACHE_TTL}s.")

    def get(self, key: str) -> Optional[Any]:
        """Retrieves an item from the cache. Logs hit/miss events."""
        value = self._cache.get(key)
        if value is not None:
            logger.info(f"CACHE HIT - Query: '{key}'")
        else:
            logger.info(f"CACHE MISS - Query: '{key}'")
        return value

    def set(self, key: str, value: Any) -> None:
        """Stores an item in the cache."""
        self._cache[key] = value
        logger.info(f"CACHE STORED - Query: '{key}'")

# Reusable singleton instance
cache_service = CacheService()
