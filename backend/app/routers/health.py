from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class MetaResponse(BaseModel):
    project: str = Field(..., example="SentiScope")
    status: str = Field(..., example="running")
    version: str = Field(..., example="1.0")

class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")

@router.get(
    "/",
    response_model=MetaResponse,
    summary="Project Meta Status",
    description="Returns project naming parameters, current runtime state, and release version."
)
async def get_meta() -> MetaResponse:
    return MetaResponse(
        project="SentiScope",
        status="running",
        version="1.0"
    )

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Probe",
    description="Returns simple server health check status for load balancer polling."
)
async def check_health() -> HealthResponse:
    return HealthResponse(status="healthy")

@router.get(
    "/health/bluesky",
    summary="Bluesky Health Probe",
    description="Verifies that the SDK client is authenticated and usable."
)
async def check_bluesky_health():
    import asyncio
    from app.services.bluesky_service import bluesky_service
    
    try:
        await asyncio.to_thread(bluesky_service.ensure_authenticated)
    except Exception:
        pass
        
    me = bluesky_service.client.me
    if me is not None and me.handle:
        return {
            "authenticated": True,
            "account": me.handle
        }
        
    return {
        "authenticated": False,
        "account": None
    }
