import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger

class TelemetryMiddleware(BaseHTTPMiddleware):
    """Middleware for request logging, timing, and Request-ID propagation."""

    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())
        # Store request_id in request state for internal service tracking
        request.state.request_id = request_id

        start_time = time.perf_counter()
        
        logger.info(
            f"Request Start: {request.method} {request.url.path} "
            f"| Client: {request.client.host if request.client else 'unknown'} "
            f"| Request-ID: {request_id}"
        )

        try:
            response = await call_next(request)
        except Exception as e:
            process_time_ms = (time.perf_counter() - start_time) * 1000
            logger.exception(
                f"Request Exception: {request.method} {request.url.path} "
                f"| Request-ID: {request_id} "
                f"| Duration: {process_time_ms:.2f}ms "
                f"| Exception: {str(e)}"
            )
            raise e

        process_time_ms = (time.perf_counter() - start_time) * 1000
        
        # Attach telemetry data in response headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-Ms"] = f"{process_time_ms:.2f}"

        logger.info(
            f"Request End: {request.method} {request.url.path} "
            f"| Status: {response.status_code} "
            f"| Request-ID: {request_id} "
            f"| Duration: {process_time_ms:.2f}ms"
        )

        return response
