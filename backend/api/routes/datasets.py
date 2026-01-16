"""
Dataset API endpoints
"""
from fastapi import APIRouter, HTTPException, status, Path

from schemas.dataset_schema import DatasetItem, DatasetFields
from services.dataset_service import dataset_service
from core.security import validate_dataset_exists
from api.dependencies import get_verified_token

router = APIRouter(prefix="/share", tags=["datasets"])


@router.get(
    "/{token}/datasets",
    response_model=list[DatasetItem],
    summary="List all available datasets",
    description="Returns list of datasets available for the given token"
)
async def list_datasets(
    token: str = Path(...)
) -> list[DatasetItem]:
    """
    Get all datasets available for sharing
    
    Args:
        token: Share token from URL path
    
    Returns:
        List of dataset items
    """
    get_verified_token(token)
    return dataset_service.get_all_datasets()


@router.get(
    "/{token}/dataset/{dataset_id}/fields",
    response_model=DatasetFields,
    summary="Get dataset fields",
    description="Returns available dimensions and measures for a dataset"
)
async def get_dataset_fields(
    token: str = Path(...),
    dataset_id: str = Path(...)
) -> DatasetFields:
    """
    Get dimensions and measures for a specific dataset
    
    Args:
        token: Share token from URL path
        dataset_id: Dataset ID
    
    Returns:
        DatasetFields with dimensions and measures
    
    Raises:
        HTTPException: If dataset not found
    """
    # Verify token
    get_verified_token(token)
    
    # Validate dataset exists (this will raise if not found)
    validate_dataset_exists(dataset_id)
    
    # Get fields
    fields = dataset_service.get_dataset_fields(dataset_id)
    
    if not fields:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset '{dataset_id}' not found"
        )
    
    return fields
