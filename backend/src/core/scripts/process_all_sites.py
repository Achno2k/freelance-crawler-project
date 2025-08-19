import json
import os
from schemas import LLMResponse
from core.llm.llm_client import process_website
from config import sites_prompt_map
from typing import List, Dict
from logger import logger

OUTPUT_PATH = "../output/results.json"

async def process_web_sources():
    all_results: Dict[str, List[LLMResponse]] = {}

    for domain, site_config in sites_prompt_map.site_prompt_map.items():

        url = site_config.get_url()
        if not url:
            logger.warning(f"No URL provided for {domain}. Skipping.")
            continue

        logger.info(f"Processing {domain} ({url})")
        try:
            results: List[LLMResponse] = await process_website(url, site_config)
            all_results[domain] = results
        except Exception as e:
            logger.info(f"Failed to process {domain}: {e}")


    output_dir = os.path.dirname(OUTPUT_PATH)
    os.makedirs(output_dir, exist_ok=True)

    try:
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(
                {k: [r.to_dict() for r in v] for k, v in all_results.items()},
                f,
                indent=2,
                ensure_ascii=False
            )
        (f"\nAll results saved to: {OUTPUT_PATH}")
        return all_results
    except Exception as e:
        print(f"[ERROR] Failed to save results to {OUTPUT_PATH}: {e}")
    
