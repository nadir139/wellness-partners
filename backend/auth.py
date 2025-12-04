"""
Authentication middleware using Supabase Auth

Verifies JWT tokens issued by Supabase and extracts user information.
Supabase can use either:
- HS256 (symmetric) with JWT secret for older/self-hosted instances
- ES256 (asymmetric ECDSA) with JWKS for newer cloud instances

This module auto-detects the algorithm and handles both cases.
"""
import jwt
import json
import base64
import requests
from jwt import PyJWKClient
from typing import Optional
from fastapi import HTTPException, Header
from . import config

# Supabase configuration
SUPABASE_URL = config.SUPABASE_URL
SUPABASE_JWT_SECRET = config.SUPABASE_JWT_SECRET

# JWKS client for ES256 tokens (caches keys automatically)
# Supabase JWKS endpoint: {supabase_url}/auth/v1/.well-known/jwks.json
_jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
_jwks_client = None

def _get_jwks_client():
    """Get or create JWKS client (lazy initialization with caching)."""
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(_jwks_url)
    return _jwks_client

def _decode_jwt_header(token: str) -> dict:
    """Decode JWT header without verification to check algorithm."""
    try:
        header_b64 = token.split('.')[0]
        # Add padding if needed
        header_b64 += '=' * (4 - len(header_b64) % 4) if len(header_b64) % 4 else ''
        return json.loads(base64.urlsafe_b64decode(header_b64))
    except:
        return {}


async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Verify JWT token from Supabase Auth and return user information.

    Supabase tokens contain:
    - sub: user ID (UUID)
    - email: user's email address
    - exp: expiration timestamp

    Args:
        authorization: Bearer token from request header (format: "Bearer <token>")

    Returns:
        dict: User information with user_id, email, first_name, last_name

    Raises:
        HTTPException: If token is invalid, expired, or missing
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing authorization header"
        )

    # Extract token from "Bearer <token>" format
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication scheme. Expected 'Bearer <token>'"
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Expected 'Bearer <token>'"
        )

    # Verify and decode the Supabase JWT token
    try:
        # Check token header to determine algorithm
        header = _decode_jwt_header(token)
        alg = header.get("alg", "HS256")

        if alg == "ES256":
            # ES256 (ECDSA) - fetch public key from JWKS endpoint
            jwks_client = _get_jwks_client()
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256"],
                options={
                    "verify_aud": False,  # Supabase audience varies
                    "verify_iss": False,  # Issuer check not needed
                }
            )
        else:
            # HS256/HS384/HS512 (HMAC) - use JWT secret directly
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256", "HS384", "HS512"],
                options={
                    "verify_aud": False,  # Supabase audience varies
                    "verify_iss": False,  # Issuer check not needed
                }
            )

        # Extract user information from JWT payload
        user_id = payload.get("sub")  # Supabase user ID (UUID)
        email = payload.get("email")  # User's email

        # Get user metadata (first_name, last_name) if available
        user_metadata = payload.get("user_metadata", {})
        first_name = user_metadata.get("first_name")
        last_name = user_metadata.get("last_name")

        return {
            "user_id": user_id,
            "email": email or "unknown@supabase.local",
            "first_name": first_name,
            "last_name": last_name
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired. Please sign in again."
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication error: {str(e)}"
        )


def get_admin_key(admin_key: Optional[str] = Header(None, alias="X-Admin-Key")):
    """
    Verify admin API key for administrative endpoints (e.g., Stage 2 analytics).

    Admin endpoints require a separate API key sent via X-Admin-Key header.
    This is independent of user authentication.

    Args:
        admin_key: Admin API key from X-Admin-Key header

    Returns:
        bool: True if valid admin key

    Raises:
        HTTPException: If admin key is invalid or missing
    """
    if not admin_key:
        raise HTTPException(
            status_code=403,
            detail="Admin key required. Please provide X-Admin-Key header."
        )

    expected_key = config.ADMIN_API_KEY
    if not expected_key:
        raise HTTPException(
            status_code=500,
            detail="Admin key not configured on server"
        )

    if admin_key != expected_key:
        raise HTTPException(
            status_code=403,
            detail="Invalid admin key"
        )

    return True
