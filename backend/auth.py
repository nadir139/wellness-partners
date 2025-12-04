"""
Authentication middleware using Clerk
"""
import jwt
import requests
from typing import Optional
from fastapi import HTTPException, Header
from . import config

# Clerk configuration
CLERK_SECRET_KEY = config.CLERK_SECRET_KEY
CLERK_JWKS_URL = f"https://{config.CLERK_INSTANCE_ID}.clerk.accounts.dev/.well-known/jwks.json"


async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Verify JWT token from Clerk and return user ID.

    Args:
        authorization: Bearer token from request header

    Returns:
        dict: User information including user_id

    Raises:
        HTTPException: If token is invalid or missing
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
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format"
        )

    # Verify token with Clerk
    try:
        # Decode the JWT token without verification first to get headers
        unverified_header = jwt.get_unverified_header(token)

        # Fetch JWKS from Clerk
        jwks_response = requests.get(CLERK_JWKS_URL)
        jwks = jwks_response.json()

        # Find the matching key
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        if not rsa_key:
            raise HTTPException(
                status_code=401,
                detail="Unable to find appropriate key"
            )

        # Verify and decode the token
        payload = jwt.decode(
            token,
            key=jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key),
            algorithms=["RS256"],
            options={"verify_aud": False}  # Clerk doesn't require audience verification
        )

        # Extract user information from the token payload
        # Clerk stores email in the 'email' claim, but it might be in email_addresses
        email = payload.get("email")
        if not email and "email_addresses" in payload:
            # Try to get from email_addresses array if available
            email_addresses = payload.get("email_addresses", [])
            if email_addresses and len(email_addresses) > 0:
                email = email_addresses[0].get("email_address")

        # Use a default email if not found
        if not email:
            email = "user@clerk.local"

        return {
            "user_id": payload.get("sub"),
            "email": email,
            "first_name": payload.get("first_name"),
            "last_name": payload.get("last_name"),
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
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


def get_admin_key(admin_key: Optional[str] = Header(None)):
    """
    Verify admin API key for administrative endpoints.

    Args:
        admin_key: Admin API key from header

    Returns:
        bool: True if valid admin key

    Raises:
        HTTPException: If admin key is invalid or missing
    """
    if not admin_key:
        raise HTTPException(
            status_code=403,
            detail="Admin key required"
        )

    expected_key = config.ADMIN_API_KEY
    if not expected_key:
        raise HTTPException(
            status_code=500,
            detail="Admin key not configured"
        )

    if admin_key != expected_key:
        raise HTTPException(
            status_code=403,
            detail="Invalid admin key"
        )

    return True
