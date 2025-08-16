from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from scripts.process_all_sites import process_web_sources
from auth.oauth2 import get_current_user
import json

router = APIRouter(
    prefix="/results",
    tags=["Generate responses from the websites"]
)

@router.get("/info")
async def scraping_response(user = Depends(get_current_user)):
    if not user: 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please login to continue to this page")
    # raw_data = await process_web_sources()
    # if not raw_data:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Results not found")
    
    data_json = {}
    # for domain, responses in raw_data.items():
    #     data_json[domain] = []
    #     for response in responses:
    #         try:
    #             data_json[domain].append(response.to_dict())
    #         except:
    #             data_json[domain].append({
    #                 "project_name": str(response.project_name),
    #                 "department": str(response.department),
    #                 "location": str(response.location),
    #                 "budget": response.budget,
    #                 "deadline": response.deadline,
    #                 "contact_info": str(response.contact_info),
    #                 "requirements": str(response.requirements),
    #                 "extracted_at": str(response.extracted_at),
    #                 "source": response.pdf_link
    #             })
    OUTPUT_FILE_PATH = "../output/mock_data.json"
    with open(OUTPUT_FILE_PATH, "r", encoding="utf-8") as f:
        data_json = json.load(f)

    return JSONResponse(
            content=data_json, 
            status_code=status.HTTP_200_OK, 
            media_type="application/json"
        )
  