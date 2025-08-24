import sqlalchemy as sa
from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
from sqlalchemy.dialects.postgresql import UUID
from typing import Optional
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[Optional[str]] = mapped_column(sa.String)
    last_name: Mapped[Optional[str]] = mapped_column(sa.String)
    email: Mapped[str] = mapped_column(sa.String, unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(sa.String, nullable=False)
    is_active: Mapped[bool] = mapped_column(sa.Boolean, default=True, nullable=False)
    is_email_verified: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), onupdate=func.now(), nullable=True)
    failed_login_attempts: Mapped[int] = mapped_column(default=0, nullable=True)
    locked_until: Mapped[Optional[datetime]] = mapped_column(sa.DateTime(timezone=True), nullable=True)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash: Mapped[str] = mapped_column(sa.String, nullable=False, index=True)
    device_info: Mapped[Optional[str]] = mapped_column(sa.String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(sa.DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(default=False)
    replaced_by: Mapped[Optional[int]] = mapped_column(nullable=True)
