from apscheduler.schedulers.asyncio import AsyncIOScheduler
from cache.utils import set_results

schedular = AsyncIOScheduler()

def start_job():
    schedular.add_job(set_results, "interval", hours=24)
    schedular.start()
