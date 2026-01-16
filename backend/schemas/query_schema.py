"""
Pydantic models for queries
"""
from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel, Field


class ExploreQuery(BaseModel):
    """Explore query request payload"""
    dataset_id: str = Field(..., description="Dataset ID")
    dimension: str = Field(..., description="Dimension to group by")
    measure: str = Field(..., description="Measure to aggregate")
    date_from: date = Field(..., description="Start date (YYYY-MM-DD)")
    date_to: date = Field(..., description="End date (YYYY-MM-DD)")
    platform: Optional[str] = Field(None, description="Optional platform filter")
    limit: int = Field(default=500, ge=1, le=5000, description="Max rows (1-5000)")
    order: Literal["asc", "desc"] = Field(default="asc", description="Sort order")

    class Config:
        json_schema_extra = {
            "example": {
                "dataset_id": "orders",
                "dimension": "dt",
                "measure": "revenue",
                "date_from": "2025-01-01",
                "date_to": "2025-01-16",
                "platform": "tiktok",
                "limit": 500,
                "order": "asc"
            }
        }


class QueryRow(BaseModel):
    """Single row in query result"""
    pass  # Dynamic based on dimension/measure


class QueryResponse(BaseModel):
    """Explore query response"""
    rows: list[dict]

    class Config:
        json_schema_extra = {
            "example": {
                "rows": [
                    {"dt": "2025-01-01", "revenue": 1000},
                    {"dt": "2025-01-02", "revenue": 1500},
                ]
            }
        }
