"""
Query API endpoints
"""
from fastapi import APIRouter, Body, Path

from schemas.query_schema import ExploreQuery, QueryResponse
from services.query_service import query_service
from api.dependencies import get_verified_token

router = APIRouter(prefix="/share", tags=["queries"])


@router.post(
    "/{token}/query",
    response_model=QueryResponse,
    summary="Execute explore query",
    description="Execute a query to explore data by dimension and measure"
)
async def execute_query(
    token: str = Path(...),
    payload: ExploreQuery = Body(...)
) -> QueryResponse:
    """
    Execute an explore query
    
    Args:
        token: Share token from URL path
        payload: Query parameters (dimension, measure, date range, etc)
    
    Returns:
        QueryResponse with result rows
    
    Raises:
        HTTPException: If validation or query execution fails
    """
    get_verified_token(token)
    return query_service.execute_query(payload)
