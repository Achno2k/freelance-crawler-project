import asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime

from logger import logger
from routes import results, users
from database import engine, Base
from config.loader import settings
from cache.utils import set_results
from cache.client import get_redis

schedular = AsyncIOScheduler()

logger.info("API Starting...")

def start_job():
    schedular.add_job(
        set_results, 
        "interval", 
        hours=24,
        next_run_time=datetime.now()  
    )
    schedular.start()   

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

async def redis_init():
    try:
        client = await get_redis()
        await client.ping()
        logger.info("Redis connected")
    except Exception as e:
        logger.error(f"Redis connection failed: {str(e)}")
        raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Starting the db
        await init_db()
        logger.info("Application DB startup complete")
        # Connecting to redis
        await redis_init()
        logger.info("Redis successfully connected")
        # Now starting the schedular (sync job)
        start_job()
        logger.info("Schedular job successfully started")
        yield
    except Exception as e:
        logger.error("DB startup failed.")
    finally:
        await engine.dispose()
        logger.info("Application shutdown complete and engine disposed")
    

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(results.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Hello World!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
