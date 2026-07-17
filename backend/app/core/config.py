import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 8000
    CACHE_TTL: int = 600
    LOG_LEVEL: str = "INFO"

    # SettingsConfigDict specifies env loading configurations for Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
