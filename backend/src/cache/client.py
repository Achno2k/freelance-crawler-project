import redis.asyncio as redis
from config.loader import settings

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=0,
    decode_responses=True,  
    socket_connect_timeout=5,  
    socket_timeout=5,  
    retry_on_timeout=True,  
)

async def get_redis() -> redis.Redis:
    return redis_client

