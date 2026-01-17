"""
Configuration settings for the backend application
"""
import os
from typing import Optional
# FastAPI Config
DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
API_TITLE: str = "Data Explorer API"
API_VERSION: str = "1.0.0"

# BigQuery Config
GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "your-project-id")
BIGQUERY_DATASET: str = os.getenv("BIGQUERY_DATASET", "your-dataset")

# Auth Config
SHARE_TOKENS: dict[str, dict] = {
    "demo_token_123": {"active": True, "label": "Demo Share Link"},
    "demo123": {"active": True, "label": "Demo Share Link (Short)"},
    "prod_token_456": {"active": True, "label": "Production Share"},
}

# API Config
MAX_QUERY_LIMIT: int = 5000
DEFAULT_QUERY_LIMIT: int = 500

# CORS Config
CORS_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://192.168.4.92:3000",
    "https://data-explorer-alpha.vercel.app"
]
# Logging Config
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
