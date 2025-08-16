from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncEngine
from sqlalchemy.orm import declarative_base
from config.loader import settings

engine: AsyncEngine = create_async_engine(settings.ASYNC_DATABASE_URL, future=True, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

# database dependency for routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
