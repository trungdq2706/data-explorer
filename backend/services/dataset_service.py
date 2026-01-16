"""
Dataset business logic service
"""
from constants.datasets import DATASETS_REGISTRY
from schemas.dataset_schema import DatasetItem, DatasetFields


class DatasetService:
    """Service for dataset operations"""
    
    @staticmethod
    def get_all_datasets() -> list[DatasetItem]:
        """
        Get all available datasets
        
        Returns:
            List of datasets with id and label
        """
        return [
            DatasetItem(
                id=dataset_id,
                label=config["label"]
            )
            for dataset_id, config in DATASETS_REGISTRY.items()
        ]
    
    @staticmethod
    def get_dataset_fields(dataset_id: str) -> DatasetFields:
        """
        Get dimensions and measures for a dataset
        
        Args:
            dataset_id: Dataset ID
        
        Returns:
            DatasetFields with list of dimensions and measures
        """
        dataset = DATASETS_REGISTRY.get(dataset_id)
        
        if not dataset:
            return None
        
        return DatasetFields(
            dimensions=list(dataset["dimensions"].keys()),
            measures=list(dataset["measures"].keys())
        )


# Singleton instance
dataset_service = DatasetService()
