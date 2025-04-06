import os
import openai
import time
import logging
from typing import List

openai.api_key = os.getenv("OPENAI_API_KEY")
logger = logging.getLogger(__name__)

def call_gpt(messages, model="gpt-4", temperature=0.7, retries=3):
    for attempt in range(retries):
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=temperature,
            )
            return response.choices[0].message["content"]
        except Exception as e:
            logger.warning(f"GPT call failed on attempt {attempt + 1}: {e}")
            time.sleep(2 * (attempt + 1))
    raise RuntimeError("GPT call failed after retries.")

def build_prompt(html: str, goal: str) -> List[dict]:
    instructions_by_goal = {
        "increase add to cart": "Suggest changes that would encourage more users to add products to their cart.",
        "boost email signups": "Suggest changes that would make users more likely to sign up for email newsletters.",
        "drive product views": "Suggest changes that help users discover and explore products more easily.",
        "improve trust / social proof": "Suggest changes that build trust and credibility, such as trust badges, reviews, or testimonials."
    }
    instructions = instructions_by_goal.get(goal.lower(), "Suggest general improvements to increase user conversion.")
    return [
        {"role": "system", "content": f"You are a CRO expert. {instructions}"},
        {"role": "user", "content": f"Here is the HTML of the page:\n{html[:5000]}"},
        {"role": "system", "content": (
            "ONLY respond in valid JSON. Do not use markdown or commentary. Wrap your response like this:\n"
            "```json\n{\"rationale\": string, \"suggestions\": [{\"text\": string, \"type\": string, \"target\": string, \"impact\": string}]}\n```\n"
            "Fill in realistic suggestion values for the page above."
        )}
    ]