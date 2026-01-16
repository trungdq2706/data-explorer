"""
BigQuery service for database operations
"""
from datetime import date, timedelta
from typing import Optional
import logging
import re
from random import randint, choice

logger = logging.getLogger(__name__)


class BigQueryService:
    """Service for BigQuery operations"""
    
    def __init__(self):
        """Initialize BigQuery client"""
        # TODO: Initialize real BigQuery client
        # from google.cloud import bigquery
        # self.client = bigquery.Client()
        pass
    
    @staticmethod
    def _generate_mock_data(
        date_from: date,
        date_to: date,
        platform: Optional[str] = None
    ) -> list[dict]:
        """
        Generate realistic mock data for testing
        
        Args:
            date_from: Start date
            date_to: End date
            platform: Optional platform filter
        
        Returns:
            List of mock data rows
        """
        platforms = ["tiktok", "instagram", "facebook", "youtube"]
        if platform:
            platforms = [platform]
        
        data = []
        current_date = date_from
        
        while current_date <= date_to:
            for plat in platforms:
                # Generate realistic revenue (1000-10000)
                revenue = randint(1000, 10000) * (1 + randint(-50, 50) / 100)
                revenue = round(revenue, 2)
                
                data.append({
                    "dt": current_date.isoformat(),
                    "platform": plat,
                    "revenue": revenue,
                    "orders": randint(10, 100),
                    "sessions": randint(50, 500),
                    "hosts": choice(["host_a", "host_b", "host_c"]),
                    "product_name": choice(["Product A", "Product B", "Product C", "Product D"]),
                })
            
            current_date += timedelta(days=1)
        
        return data
    
    def execute_query(
        self,
        sql: str,
        date_from: date,
        date_to: date,
        platform: Optional[str] = None,
    ) -> list[dict]:
        """
        Execute BigQuery query with parameters
        
        Args:
            sql: SQL query with @parameters
            date_from: Start date parameter
            date_to: End date parameter
            platform: Optional platform filter
        
        Returns:
            List of result rows as dictionaries
        
        Raises:
            Exception: If BigQuery query fails
        """
        try:
            logger.info(f"Executing query for period {date_from} to {date_to}, platform={platform}")
            
            # Generate mock data
            all_data = self._generate_mock_data(date_from, date_to, platform)
            
            # Parse SQL to determine what fields to return
            # In real scenario, this would query BigQuery
            # For mock, we'll parse the SQL and extract dimension/measure
            lines = sql.split('\n')
            select_line = [l for l in lines if 'SELECT' in l.upper()]
            
            # Parse SQL to extract SELECT fields
            sql_clean = ' '.join(sql.split())  # Remove all whitespace/newlines
            select_match = re.search(r'SELECT\s+(.*?)\s+FROM', sql_clean, re.IGNORECASE)
            
            if select_match:
                select_part = select_match.group(1)
                # Extract field names after AS keyword
                fields = []
                for field in select_part.split(','):
                    if ' AS ' in field:
                        field_name = field.split(' AS ')[-1].strip()
                        fields.append(field_name)
                    elif field.strip():
                        fields.append(field.strip())
            else:
                fields = ["dimension", "measure"]
            
            # Filter and group mock data based on SQL
            result = {}
            for row in all_data:
                # Build a key for grouping
                if fields:
                    group_key = str(row.get(fields[0], ""))
                else:
                    group_key = str(row.get("dt", ""))
                
                if group_key not in result:
                    result[group_key] = {fields[0] if fields else "dt": row.get(fields[0] if fields else "dt")}
                
                # Aggregate measures
                if len(fields) > 1:
                    measure_field = fields[1]
                    if measure_field not in result[group_key]:
                        result[group_key][measure_field] = 0
                    
                    # Handle SUM (revenue, orders)
                    if measure_field in ["revenue", "orders", "sessions"]:
                        result[group_key][measure_field] += row.get(measure_field, 0)
                    else:
                        result[group_key][measure_field] = row.get(measure_field, 0)
            
            # Convert to list and round values
            mock_result = []
            for key, value in sorted(result.items()):
                # Round revenue to 2 decimals
                if "revenue" in value:
                    value["revenue"] = round(value["revenue"], 2)
                mock_result.append(value)
            
            logger.info(f"Returned {len(mock_result)} rows")
            return mock_result
            
        except Exception as e:
            logger.error(f"BigQuery error: {str(e)}")
            raise


# Singleton instance
bigquery_service = BigQueryService()
