import asyncio
import logging
from typing import Optional

import uvicorn
from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from contextlib import asynccontextmanager
from routes import results, users
from schemas import LLMResponse
from database import engine, Base
import models  
from config.loader import settings
from auth.oauth2 import get_current_user

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(results.router)
app.include_router(users.router)

async def init_db(retries: int = 5, delay_seconds: int = 2) -> None:
    """
    Create tables (using run_sync for sync metadata.create_all)
    and verify DB connectivity. Retries are useful when DB may start later
    (e.g. in docker-compose).
    """
    for attempt in range(1, retries + 1):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
                await conn.execute(text("SELECT 1"))
            logger.info("Database initialized and reachable.")
            return
        except SQLAlchemyError as exc:
            logger.warning(
                "DB init/connection failed (attempt %d/%d): %s",
                attempt,
                retries,
                exc,
            )
            if attempt == retries:
                logger.error("Exceeded DB init retries, re-raising.")
                raise
            await asyncio.sleep(delay_seconds)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await init_db()
        logger.info("Application startup complete.")
        yield
    except Exception as e:
        logger.error("DB startup failed.")
    finally:
        await engine.dispose()
        logger.info("Application shutdown complete and engine disposed.")
    

@app.get("/")
async def root():
    return {"message": "Hello World!"}

@app.get("/me") 
async def get_details(user = Depends(get_current_user)):
    return {"user_details": user.email}


# If you need the commented scraping route, re-enable and adjust as needed
# @app.get("/results")
# async def scraping_response():
#     raw_data = await process_web_sources()
#     if not raw_data:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Results not found")
#     ...  (your processing)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
