import sqlalchemy as sa
from sqlalchemy import func
from database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    __tablename__ = "users"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = sa.Column(sa.String)
    last_name = sa.Column(sa.String)
    email = sa.Column(sa.String, unique=True, nullable=False, index=True)
    password_hash = sa.Column(sa.String, nullable=False)
    is_active = sa.Column(sa.Boolean, default=True, nullable=False)
    is_email_verified = sa.Column(sa.Boolean, default=False)
    created_at = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    updated_at = sa.Column(sa.DateTime(timezone=True), onupdate=func.now())
    failed_login_attempts = sa.Column(sa.Integer, default=0)
    locked_until = sa.Column(sa.DateTime(timezone=True), nullable=True)
    
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = sa.Column(sa.String, nullable=False, index=True)  
    device_info = sa.Column(sa.String, nullable=True)
    created_at = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    expires_at = sa.Column(sa.DateTime(timezone=True), nullable=False)
    revoked = sa.Column(sa.Boolean, default=False)
    replaced_by = sa.Column(UUID(as_uuid=True), nullable=True)
