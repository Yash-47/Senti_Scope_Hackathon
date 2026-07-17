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

        # System prompt optimized for factual BI reporting
        system_instruction = (
            "You are a Senior Business Intelligence Analyst.\n"
            "Your responsibility is to transform structured social media analytics into a concise executive summary.\n\n"
            "IMPORTANT RULES:\n"
            "- Use ONLY the information supplied.\n"
            "- Never invent facts.\n"
            "- Never assume the reason behind public opinion.\n"
            "- Never mention events, organizations, or people unless they appear in the supplied analytics or representative posts.\n"
            "- If the evidence is insufficient to explain WHY people feel a certain way, simply describe the observed discussion.\n"
            "- Do not speculate. Do not exaggerate. Do not use sensational language.\n"
            "- Your job is to summarize evidence, not interpret unknown causes.\n"
            "- Write in a neutral, analytical tone.\n"
            "- Return only the summary text without any introduction or label.\n\n"
            "WRITING STYLE & STRUCTURE:\n"
            "The summary must address:\n"
            "1. What people are discussing\n"
            "2. Overall public mood\n"
            "3. Dominant topics driving conversation\n"
            "4. Notable public concerns or positive trends\n\n"
            "- Avoid mentioning exact percentages unless they help explain an important observation.\n"
            "- Avoid generic phrases such as 'mixed sentiment' unless they are genuinely supported.\n"
            "- Prefer explanations over statistics.\n"
            "- Length must be strictly between 80 and 120 words."
        )

        prompt = (
            "Analyze the following social media intelligence dashboard analytics JSON and write the executive summary.\n\n"
            "Analytics JSON Data:\n"
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
