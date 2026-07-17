import re
from pydantic import BaseModel, Field, field_validator
from app.exceptions.custom_exceptions import InvalidKeyword

class AnalyzeRequest(BaseModel):
    keyword: str = Field(..., min_length=1, max_length=100, description="The query keyword to analyze on social media.")

    @field_validator("keyword")
    @classmethod
    def validate_search_term(cls, v: str) -> str:
        # Strip leading/trailing whitespaces
        term = v.strip()

        # Reject empty or whitespace-only strings
        if not term:
            raise InvalidKeyword("Keyword cannot be empty or whitespace-only.")

        # Enforce minimum length of 2 characters
        if len(term) < 2:
            raise InvalidKeyword("Keyword must be at least 2 characters long.")

        # Enforce maximum length of 50 characters
        if len(term) > 50:
            raise InvalidKeyword("Keyword must not exceed 50 characters.")

        # Reject special-character-only strings (must contain at least one alphanumeric character)
        if not re.search(r"[a-zA-Z0-9]", term):
            raise InvalidKeyword("Keyword must contain at least one letter or number.")

        return term
