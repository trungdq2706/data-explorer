"""
Query business logic service
"""
from datetime import date
from typing import Optional
import logging

from schemas.query_schema import ExploreQuery, QueryResponse
from core.security import (
    validate_dataset_exists,
    validate_dimension,
    validate_measure,
    validate_query
)
from services.bigquery_service import bigquery_service
from constants.datasets import DATASETS_REGISTRY

logger = logging.getLogger(__name__)


class QueryService:
    """Service for query operations"""
    
    @staticmethod
    def build_sql(
        dataset_config: dict,
        dimension: str,
        measure: str,
        date_from: date,
        date_to: date,
        platform: Optional[str] = None,
        limit: int = 500,
        order: str = "asc"
    ) -> str:
        """
        Build safe SQL query from validated parameters
        
        Args:
            dataset_config: Dataset configuration
            dimension: Dimension key
            measure: Measure key
            date_from: Start date
            date_to: End date
            platform: Optional platform filter
            limit: Row limit
            order: Sort order
        
        Returns:
            SQL query string
        """
        dim_expr = dataset_config["dimensions"][dimension]
        meas_expr = dataset_config["measures"][measure]
        table = dataset_config["table"]
        
        # Build SQL safely (only using whitelisted expressions)
        sql = f"""
        SELECT
            {dim_expr} AS {dimension},
            {meas_expr} AS {measure}
        FROM `{table}`
        WHERE {dim_expr} BETWEEN @date_from AND @date_to
            AND (@platform IS NULL OR platform = @platform)
        GROUP BY {dimension}
        ORDER BY {dimension} {order.upper()}
        LIMIT {limit}
        """
        
        return sql.strip()
    
    @staticmethod
    def execute_query(query: ExploreQuery) -> QueryResponse:
        """
        Execute a complete explore query
        
        Args:
            query: ExploreQuery request payload
        
        Returns:
            QueryResponse with result rows
        
        Raises:
            HTTPException: If validation fails
        """
        # Validate query
        validate_query(query)
        
        # Validate dataset
        dataset = validate_dataset_exists(query.dataset_id)
        
        # Validate dimension and get safe expression
        validate_dimension(dataset, query.dimension)
        
        # Validate measure and get safe expression
        validate_measure(dataset, query.measure)
        
        # Build SQL
        sql = QueryService.build_sql(
            dataset_config=dataset,
            dimension=query.dimension,
            measure=query.measure,
            date_from=query.date_from,
            date_to=query.date_to,
            platform=query.platform,
            limit=query.limit,
            order=query.order
        )
        
        logger.info(f"Executing query for dataset={query.dataset_id}, dim={query.dimension}, meas={query.measure}")
        
        # Execute query
        rows = bigquery_service.execute_query(
            sql=sql,
            date_from=query.date_from,
            date_to=query.date_to,
            platform=query.platform
        )
        
        return QueryResponse(rows=rows)


# Singleton instance
query_service = QueryService()
