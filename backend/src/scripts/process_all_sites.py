import json
import os
from schemas import LLMResponse
from llm.llm_client import process_website
from config import sites_prompt_map
from typing import List, Dict

OUTPUT_PATH = "./output/results.json"

async def process_web_sources():
    all_results: Dict[str, List[LLMResponse]] = {}

    for domain, site_config in sites_prompt_map.site_prompt_map.items():

        url = site_config.get_url()
        if not url:
            print(f"[WARN] No URL provided for {domain}. Skipping.")
            continue

        print(f"\n🔍 Processing {domain} ({url})")
        try:
            results: List[LLMResponse] = await process_website(url, site_config)
            all_results[domain] = results
        except Exception as e:
            print(f"[ERROR] Failed to process {domain}: {e}")


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
        print(f"\n📁 All results saved to: {OUTPUT_PATH}")
        return all_results
    except Exception as e:
        print(f"[ERROR] Failed to save results to {OUTPUT_PATH}: {e}")
    


# async def main():
#     data = await process_all_sites()
#     return data
