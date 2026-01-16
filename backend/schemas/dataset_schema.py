"""
Pydantic models for datasets
"""
from pydantic import BaseModel


class DatasetItem(BaseModel):
    """Dataset list item response"""
    id: str
    label: str


class DatasetFields(BaseModel):
    """Dataset fields response"""
    dimensions: list[str]
    measures: list[str]
