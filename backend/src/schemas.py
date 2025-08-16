from dataclasses import dataclass
from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, EmailStr
import uuid

@dataclass
class LLMResponse:
    """Extracted tender information"""
    project_name: str
    department: str
    location: str
    budget: Optional[float]
    deadline: Optional[str]
    contact_info: str
    requirements: str
    extracted_at: datetime
    pdf_link: Optional[str]

    def to_dict(self):
        return {
            "project_name": self.project_name,
            "department": self.department,
            "location": self.location,
            "budget": self.budget,
            "deadline": self.deadline,
            "contact_info": self.contact_info,
            "requirements": self.requirements,
            "extracted_at": self.extracted_at.isoformat() if self.extracted_at else None,
            "source": self.pdf_link if self.pdf_link else None
        }
    

class CrawlResult(BaseModel):
    markdown: str
    pdf_urls: Optional[List[str]]
    url: str

class WebsitePromptConfig(BaseModel):
    url: str
    content_type: str
    prompt: str

    def get_url(self) -> str:
        return self.url
    
    def get_content_type(self) -> str:
        return self.content_type
    
    def get_prompt(self) -> str:
        return self.prompt
    
class UserCreate(BaseModel):
    first_name: str 
    last_name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str




    # {
#   "https://shasanadesh.up.gov.in":  {
#     "url": "https://shasanadesh.up.gov.in",
#     "content_type": "pdf",
#     "prompt": "You are given text extracted from a government tender document.gov_tender_construction_v1 Extract the following fields in JSON:\n\n- project_name: Name of the construction project (in English if possible, otherwise Hindi)\n- department: Government department or ministry issuing the tender\n- location: Project location, city, state\n- budget: Project budget amount (extract only the number, no currency symbols)\n- deadline: Last date for tender submission (format as YYYY-MM-DD if possible)\n- contact_info: Contact person, office, phone number, email\n- requirements: Key technical requirements, specifications, or conditions\n- work_description: Brief description of the work to be done\n\nReturn the extracted information as a JSON object with exactly these keys. If any field is missing, use null.",
#     "output_schema": "gov_tender_construction_v1"
#   }
# }

