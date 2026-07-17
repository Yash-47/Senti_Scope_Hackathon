import os
import json
import asyncio
import google.generativeai as genai
from loguru import logger

class GeminiService:
    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.configured = True
            logger.info("Gemini Service successfully initialized with API key.")
        else:
            self.configured = False
            logger.warning("Gemini Service initialized WITHOUT API key. Fallback summary will be used.")

    async def generate_executive_summary(self, analytics_data: dict) -> str:
        """Generates a professional business executive summary using Gemini.
        
        Enforces a 6-second timeout limit for safety.
        """
        if not self.configured:
            raise RuntimeError("Gemini API key is not configured.")

        # System prompt setting Gemini strictly as a BI reporting layer
        system_instruction = (
            "You are a Senior Business Intelligence Reporter.\n"
            "Your sole responsibility is to summarize the provided structured business intelligence data into a professional executive summary.\n\n"
            "IMPORTANT RULES:\n"
            "- Gemini is strictly a reporting layer. You must NOT analyze raw posts or try to discover new insights independently.\n"
            "- Summarize ONLY the supplied statistics, topic intelligence, business insights, risk assessment, and alerts.\n"
            "- Never invent facts, conclusions, or make assumptions about public opinion. If details are missing, do not speculate.\n"
            "- Never contradict the supplied analytics in any way.\n"
            "- Never mention events, organizations, or people unless they appear explicitly in the supplied JSON metrics.\n"
            "- Write in a highly professional, neutral, and clear business intelligence reporting tone.\n"
            "- Return ONLY the final summary text without any headings, labels, introductions, or pleasantries.\n\n"
            "WRITING STYLE:\n"
            "- Formulate a coherent summary answering what is being discussed, the overall public mood/sentiment, dominant topics, and key risk/concerns.\n"
            "- Avoid repeating topic names unnecessarily.\n"
            "- Avoid exact percentages unless they illustrate a critical concern or risk level.\n"
            "- Length must be strictly between 80 and 120 words."
        )

        prompt = (
            "Summarize the following social media business intelligence JSON data into an executive summary:\n\n"
            f"{json.dumps(analytics_data, indent=2)}"
        )

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_instruction
        )

        def run_call():
            response = model.generate_content(
                contents=prompt,
                generation_config={"temperature": 0.2, "max_output_tokens": 300}
            )
            return response.text

        # Enforce 6-second timeout on the API invocation
        return await asyncio.wait_for(
            asyncio.to_thread(run_call),
            timeout=6.0
        )

# Reusable singleton instance
gemini_service = GeminiService()
