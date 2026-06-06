"""Authentication service for user management and token operations."""
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.database.models import User, RevokedToken
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.core.config import get_settings
from pydantic import BaseModel, EmailStr

settings = get_settings()


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db: Session):
        self.db = db

    # ---------- helpers ----------

    def _is_revoked(self, jti: str) -> bool:
        """Check if a JWT identifier is in the revocation list."""
        return (
            self.db.query(RevokedToken).filter(RevokedToken.jti == jti).first()
            is not None
        )

    def _revoke_token(self, payload: dict) -> None:
        """Persist a token's jti in the revocation list."""
        jti = payload.get("jti")
        user_id = payload.get("user_id")
        token_type = payload.get("type", "access")
        exp = payload.get("exp")
        if not jti or not user_id or not exp:
            return
        if self._is_revoked(jti):
            return
        self.db.add(
            RevokedToken(
                jti=jti,
                user_id=user_id,
                token_type=token_type,
                expires_at=datetime.utcfromtimestamp(exp),
            )
        )
        self.db.commit()

    # ---------- user lifecycle ----------

    def create_user(self, user_data: UserCreate) -> UserResponse:
        """Create a new user."""
        existing_user = (
            self.db.query(User)
            .filter(
                (User.username == user_data.username)
                | (User.email == user_data.email)
            )
            .first()
        )

        if existing_user:
            if existing_user.username == user_data.username:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already registered",
                )
            if existing_user.email == user_data.email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered",
                )

        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
        )

        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)

        return UserResponse.model_validate(db_user)

    def authenticate_user(self, username: str, password: str) -> TokenResponse:
        """Authenticate user and return tokens."""
        user = self.db.query(User).filter(User.username == username).first()

        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user",
            )

        return self._issue_tokens(user)

    def _issue_tokens(self, user: User) -> TokenResponse:
        """Issue a fresh pair of access/refresh tokens for a user."""
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": user.username, "user_id": user.id},
            expires_delta=access_token_expires,
        )
        refresh_token = create_refresh_token(
            data={"sub": user.username, "user_id": user.id},
        )
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_expire_minutes * 60,
        )

    def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token (with rotation)."""
        payload = verify_token(refresh_token, token_type="refresh")
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        jti: str = payload.get("jti")

        if username is None or user_id is None or jti is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if self._is_revoked(jti):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Rotate: revoke old refresh token, issue a brand new pair.
        self._revoke_token(payload)
        return self._issue_tokens(user)

    def logout(self, access_token: str, refresh_token: Optional[str] = None) -> None:
        """Revoke the supplied access (and optional refresh) token."""
        access_payload = verify_token(access_token, token_type="access")
        self._revoke_token(access_payload)
        if refresh_token:
            try:
                refresh_payload = verify_token(refresh_token, token_type="refresh")
                self._revoke_token(refresh_payload)
            except HTTPException:
                # Don't fail logout if the refresh token is already invalid.
                pass

    def get_current_user(self, token: str) -> User:
        """Get current user from access token."""
        payload = verify_token(token, token_type="access")
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        jti: str = payload.get("jti")

        if username is None or user_id is None or jti is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if self._is_revoked(jti):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = self.db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user
