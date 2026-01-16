"""
API dependencies
"""
from fastapi import HTTPException, status
from core.auth import verify_share_token


def get_verified_token(token: str) -> str:
    """
    Verify share token for all routes
    
    Args:
        token: Share token from path parameter
    
    Returns:
        Verified token
    
    Raises:
        HTTPException: If token is invalid
    """
    try:
        verify_share_token(token)
        return token
    except HTTPException:
        raise
