from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import uvicorn

from app.core.config import settings
from app.core.logging import setup_logging
from app.middleware import TelemetryMiddleware
from app.exceptions.custom_exceptions import SentiScopeException
from app.routers import health, analyze

# 1. Initialize Loguru global formatter overrides
setup_logging()

# 2. Bootstrap FastAPI application with clean Swagger details
app = FastAPI(
    title="SentiScope Analytics API",
    description="Real-Time Social Media Sentiment Tracking & Text Intelligence Engine.",
    version="1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 3. Configure CORS policies to allow seamless frontend Next.js communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for hackathon simplicity; refine in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Attach request execution timing and logging middleware
app.add_middleware(TelemetryMiddleware)

# 5. Register global exception handler for app-specific validation/network exceptions
@app.exception_handler(SentiScopeException)
async def sentiscope_exception_handler(request: Request, exc: SentiScopeException) -> JSONResponse:
    logger.warning(f"App validation exception caught: '{exc.message}' (HTTP {exc.status_code})")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

# 6. Register a safety exception handler for unhandled internal bugs
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(f"Unhandled system crash occurred: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred during processing."}
    )

# 7. Mount health and analysis router endpoints
app.include_router(health.router)
app.include_router(analyze.router)

if __name__ == "__main__":
    logger.info(f"Starting server on port {settings.PORT}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
