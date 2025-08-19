from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", case_sensitive=False, from_attributes=False)

    DATABASE_HOST: str
    DATABASE_PORT: str
    DATABASE_NAME: str
    DATABASE_PASSWORD: str
    DATABASE_USER: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRES_MIN: int = 15
    REFRESH_TOKEN_EXPIRES_DAYS: int = 14
    REDIS_HOST: str
    REDIS_PORT: int
    FRONTEND_URL: str
    GEMINI_API_KEY: str

settings = Settings()
