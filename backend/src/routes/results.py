from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from auth.oauth2 import get_current_user
import json
from cache.client import get_redis

router = APIRouter(
    prefix="/results",
    tags=["Generate responses from the websites"]
)

@router.get("/info")
async def scraping_response(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please login to continue to this page"
        )

    try:
        redis_client = await get_redis()
        data = await redis_client.get("all_data_fetched_from_web_sources")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Redis unavailable: {str(e)}"
        )

    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No cached results found. Try again later."
        )
    try:
        data_json = json.loads(data)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse cached results"
        )

    return JSONResponse(
        content=data_json,
        status_code=status.HTTP_200_OK,
        media_type="application/json"
    )
