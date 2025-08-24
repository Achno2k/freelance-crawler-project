import json
from typing import Optional, List
from google import genai
from schemas import LLMResponse, WebsitePromptConfig
from datetime import datetime, timezone
from config.loader import settings
from logger import logger

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def _parse_json_response(text: str) -> dict:
        import re
        cleaned_res = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.MULTILINE).strip()
        return json.loads(cleaned_res)

def generate_output_from_llm(domain: str, content: str, site_config: WebsitePromptConfig, pdf_url: str) -> (LLMResponse | List[LLMResponse] | None):
    """
    Given the domain and content (markdown or PDF text), run the site-specific prompt
    and return the LLM's structured JSON response using Gemini.
    """
    model: str = "gemini-2.5-flash-lite"
    # Extarcting the prompt for that particular website
    prompt = site_config.get_prompt()
    if prompt is None:
        raise ValueError(f"No prompt found for domain: {domain}")
    
    # Joining the prompt with the content for the LLM
    full_prompt = f"{prompt}\n\n---\n\n{content}"

    try:
        response = client.models.generate_content(
            model = model,
            contents = full_prompt,
        )
        if response is not None and response.text is not None:
            if response.text == "Not a government construction order":
                return None
            if site_config.get_content_type() == "pdf":
                return extract_output_pdf(response.text, pdf_url)
            elif site_config.get_content_type() == "markdown":
                return extract_output_markdown(response.text)

        
    except Exception as e:
        logger.error(f"[ERROR] Gemini request failed: {e}")
        return None


def extract_output_pdf (response: str, pdf_url: str) -> Optional[LLMResponse]:
    extracted_data = _parse_json_response(response)
    llm_response = LLMResponse (
                    project_name=extracted_data.get('project_name', ''),
                    department=extracted_data.get('department', ''),
                    location=extracted_data.get('location', ''),
                    budget=extracted_data.get('budget'),
                    deadline=extracted_data.get('deadline'),
                    contact_info=extracted_data.get('contact_info', ''),
                    requirements=extracted_data.get('requirements', ''),
                    extracted_at=datetime.now(timezone.utc),
                    pdf_link=pdf_url
                )
    return llm_response


def extract_output_markdown(response: str) -> Optional[List[LLMResponse]]:
    extracted_data = _parse_json_response(response)
    
    if extracted_data is None:
        logger.error("Failed to extract or parse JSON from LLM response.")
        return None
    
    if isinstance(extracted_data, dict):
        extracted_data = [extracted_data]

    if not isinstance(extracted_data, list):
        logger.error("Expected a list of JSON objects from LLM.")
        return None

    try:
        llm_responses: List[LLMResponse] = []

        for idx, item in enumerate(extracted_data):
            if not isinstance(item, dict):
                logger.error(f"Skipping non-dict item at index {idx}")
                continue

            llm_responses.append(LLMResponse(
                project_name=item.get('project_name', ''),
                department=item.get('department', ''),
                location=item.get('location', ''),
                budget=item.get('budget'),
                deadline=item.get('deadline'),
                contact_info=item.get('contact_info', ''),
                requirements=item.get('requirements', ''),
                extracted_at=datetime.now(timezone.utc),
                pdf_link=None
            ))

        return llm_responses

    except Exception as e:
        logger.error(f"Failed to parse items into LLMResponse: {e}")
        return None
