class SentiScopeException(Exception):
    """Base exception for all SentiScope errors."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class InvalidKeyword(SentiScopeException):
    """Exception raised when keyword validation checks fail."""
    def __init__(self, message: str = "Invalid query keyword provided"):
        super().__init__(message, status_code=400)

class BlueskyUnavailable(SentiScopeException):
    """Exception raised when HTTP requests to Bluesky fail or return bad statuses."""
    def __init__(self, message: str = "Bluesky search service is currently unreachable"):
        super().__init__(message, status_code=503)

# Alias for backward compatibility
RedditUnavailable = BlueskyUnavailable

class Timeout(SentiScopeException):
    """Exception raised when API requests exceed connection thresholds."""
    def __init__(self, message: str = "Social media request query timed out"):
        super().__init__(message, status_code=504)

class UnexpectedError(SentiScopeException):
    """Generic fallback exception for unhandled application crashes."""
    def __init__(self, message: str = "An unexpected error occurred during processing"):
        super().__init__(message, status_code=500)
