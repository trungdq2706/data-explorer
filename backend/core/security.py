"""
Security & Validation
"""
from fastapi import HTTPException, status
from constants.datasets import DATASETS_REGISTRY
from schemas.query_schema import ExploreQuery


def validate_dataset_exists(dataset_id: str) -> dict:
    """
    Validate that dataset exists in registry
    
    Args:
        dataset_id: Dataset ID to validate
    
    Returns:
        Dataset configuration dict
    
    Raises:
        HTTPException: If dataset not found
    """
    dataset = DATASETS_REGISTRY.get(dataset_id)
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dataset '{dataset_id}' not found"
        )
    
    return dataset


def validate_dimension(dataset: dict, dimension: str) -> str:
    """
    Validate dimension against whitelist and return safe expression
    
    Args:
        dataset: Dataset configuration
        dimension: Dimension to validate
    
    Returns:
        Safe SQL expression for the dimension
    
    Raises:
        HTTPException: If dimension is invalid
    """
    if dimension not in dataset["dimensions"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid dimension '{dimension}'. Valid options: {list(dataset['dimensions'].keys())}"
        )
    
    return dataset["dimensions"][dimension]


def validate_measure(dataset: dict, measure: str) -> str:
    """
    Validate measure against whitelist and return safe expression
    
    Args:
        dataset: Dataset configuration
        measure: Measure to validate
    
    Returns:
        Safe SQL expression for the measure
    
    Raises:
        HTTPException: If measure is invalid
    """
    if measure not in dataset["measures"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid measure '{measure}'. Valid options: {list(dataset['measures'].keys())}"
        )
    
    return dataset["measures"][measure]


def validate_query(query: ExploreQuery) -> bool:
    """
    Validate entire query object
    
    Args:
        query: Query payload to validate
    
    Returns:
        True if valid
    
    Raises:
        HTTPException: If query is invalid
    """
    if query.date_from >= query.date_to:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="date_from must be before date_to"
        )
    
    return True
