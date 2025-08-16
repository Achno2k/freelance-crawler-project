import asyncio
import logging
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from contextlib import asynccontextmanager

from routes import results, users
from database import engine, Base
from config.loader import settings
from auth.oauth2 import get_current_user
from schedular.job import start_job

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
        # Starting the db
        await init_db()
        logger.info("Application DB startup complete")

        # Now starting the schedular 
        start_job()
        logger.info("Schedular job successfully started")
        yield
    except Exception as e:
        logger.error("DB startup failed.")
    finally:
        await engine.dispose()
        logger.info("Application shutdown complete and engine disposed")
    

@app.get("/")
async def root():
    return {"message": "Hello World!"}

@app.get("/me") 
async def get_details(user = Depends(get_current_user)):
    return {"user_details": user.email}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
