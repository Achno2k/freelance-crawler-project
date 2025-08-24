from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from database import get_db                    
from models import User, RefreshToken
from schemas import UserCreate, UserResponse, LoginResponse
import utils
from auth.jwt_utils import create_access_token, create_refresh_token
from config.loader import settings
from auth.oauth2 import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/me") 
async def get_details(user = Depends(get_current_user)):
    return {"user_details": user.email}


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # checking for existing users, if present raise an exception
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please try to login."
        )

    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password_hash=utils.hash_password(user_data.password),
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    # print(user)
    if not user or not utils.verify_password(form_data.password, str(user.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please try again."
        )

    access_token, _ = create_access_token(subject=user.id)            # (token, jti)
    refresh_token, _, _ = create_refresh_token(subject=user.id)  # (token, jti, expires_at)

    # storing the new refresh token
    db_refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(settings.REFRESH_TOKEN_EXPIRES_DAYS)
    )

    db.add(db_refresh_token)
    await db.commit()

    login_response = LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer"
    )

    return login_response

@router.post("/refresh", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def refresh_token(refresh_token: str = Body(..., embed=True), db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == refresh_token)
    )
    db_refresh_token = result.scalars().first()

    if not db_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    if bool(db_refresh_token.revoked) or bool(db_refresh_token.expires_at < datetime.now(timezone.utc)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired or revoked"
        )
    

    db_refresh_token.revoked = True # type: ignore
    # await db.commit()

    new_access_token, _ = create_access_token(subject=db_refresh_token.user_id)
    new_refresh_token, _, _ = create_refresh_token(subject=db_refresh_token.user_id)

    new_db_refresh_token = RefreshToken(
        user_id=db_refresh_token.user_id,
        token_hash=new_refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRES_DAYS),
        replaced_by=db_refresh_token.id
    )

    db.add(new_db_refresh_token)
    await db.commit()

    return LoginResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="Bearer"
    )