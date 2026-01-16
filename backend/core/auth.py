"""
Authentication & Authorization
"""
from fastapi import HTTPException, status
import config


def verify_share_token(token: str) -> bool:
    """
    Verify if the share token is valid and active
    
    Args:
        token: Share token to verify
    
    Returns:
        True if valid, raises HTTPException otherwise
    
    Raises:
        HTTPException: If token is invalid or inactive
    """
    token_info = config.SHARE_TOKENS.get(token)
    
    if not token_info or not token_info.get("active"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive share token"
        )
    
    return True
