import time
from fastapi import APIRouter, Request, Depends
from app.models.request_models import AnalyzeRequest
from app.models.response_models import AnalyzeResponse
from app.services.pipeline_service import pipeline_service

router = APIRouter(prefix="/api/v1", tags=["Analysis"])

@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze Social Sentiment",
    description=(
        "Triggers the data pipeline for a keyword: fetches Reddit search results, "
        "preprocesses post bodies, evaluates sentiment and emotions, and compiles statistics "
        "and business summaries. Implements TTL-based caching."
    ),
    response_description="A complete intelligence report containing metadata, statistics, trending topics, alerts, and analyzed posts."
)
async def analyze_sentiment(
    payload: AnalyzeRequest,
    request: Request
) -> AnalyzeResponse:
    # Capture start time for precise internal latency tracking
    start_time = time.perf_counter()
    
    # Retrieve Request-ID injected by telemetry middleware
    request_id = getattr(request.state, "request_id", "unknown-id")
    
    # Delegate orchestration flow completely to the pipeline service
    response = await pipeline_service.analyze(
        keyword=payload.keyword,
        request_id=request_id,
        start_time=start_time
    )
    
    return response
