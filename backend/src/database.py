from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncEngine
from sqlalchemy.orm import declarative_base
from config.loader import settings

engine: AsyncEngine = create_async_engine(
    url=f"postgresql+asyncpg://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}",
    future=True,
    echo=False
)
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

# database dependency for routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
