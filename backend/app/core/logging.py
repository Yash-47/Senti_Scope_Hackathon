import sys
from loguru import logger
from app.core.config import settings

def setup_logging() -> None:
    """Configures global Loguru logging formats, levels, and output destinations."""
    # Remove default logger output to prevent double logging in standard containers
    logger.remove()

    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    )

    # Output logs to stdout with appropriate console colorization
    logger.add(
        sys.stdout,
        level=settings.LOG_LEVEL.upper(),
        format=log_format,
        colorize=True,
    )
    
    logger.info(f"Logging initialized with level: {settings.LOG_LEVEL.upper()}")
