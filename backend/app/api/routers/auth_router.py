"""Authentication router for handling login, registration, refresh, and logout."""
from typing import Optional
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from app.api.dependencies import get_auth_service, get_current_user, oauth2_scheme
from app.core.config import get_settings
from app.database.models import User
from app.services.auth_service import (
    AuthService,
    TokenResponse,
    UserCreate,
    UserResponse,
)

router = APIRouter()
settings = get_settings()


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    """Set the refresh token in a secure HttpOnly cookie."""
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Set True in production behind HTTPS.
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/auth",
    )


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register_user(
    user: UserCreate, auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user."""
    return auth_service.create_user(user)


@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Authenticate user and return access + refresh tokens."""
    tokens = auth_service.authenticate_user(form_data.username, form_data.password)
    _set_refresh_cookie(response, tokens.refresh_token)
    return tokens


@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(
    response: Response,
    payload: Optional[RefreshRequest] = None,
    refresh_token_cookie: Optional[str] = Cookie(default=None, alias="refresh_token"),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Rotate refresh tokens; accept the value from cookie or JSON body."""
    refresh_token = (
        (payload.refresh_token if payload else None) or refresh_token_cookie
    )
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    tokens = auth_service.refresh_access_token(refresh_token)
    _set_refresh_cookie(response, tokens.refresh_token)
    return tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    body: Optional[LogoutRequest] = None,
    access_token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Revoke the current access token and (optionally) the refresh token."""
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    refresh_token = body.refresh_token if body else None
    auth_service.logout(access_token, refresh_token)
    response.delete_cookie("refresh_token", path="/auth")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return UserResponse.model_validate(current_user)
