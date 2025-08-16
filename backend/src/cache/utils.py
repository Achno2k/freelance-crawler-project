import json
from fastapi import status, HTTPException
from scripts.process_all_sites import process_web_sources
from client import get_redis

async def set_results():
    """
    Fetches data from web sources, processes it, and caches it in Redis.
    This job runs daily (or at a set interval, probably after 1 day) to keep the cache updated.
    """
    raw_data = await process_web_sources()
    if not raw_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No results found from web sources"
        )

    # Build JSON nicely :)
    data_json = {}
    for domain, responses in raw_data.items():
        data_json[domain] = []
        for response in responses:
            try:
                data_json[domain].append(response.to_dict())
            except AttributeError:
                data_json[domain].append({
                    "project_name": str(response.project_name),
                    "department": str(response.department),
                    "location": str(response.location),
                    "budget": response.budget,
                    "deadline": response.deadline,
                    "contact_info": str(response.contact_info),
                    "requirements": str(response.requirements),
                    "extracted_at": str(response.extracted_at),
                    "source": response.pdf_link,
                })

    redis_data = json.dumps(data_json)

    redis_client = await get_redis()
    await redis_client.set(
        "all_data_fetched_from_web_sources",
        redis_data,
        ex=86400
    )

