"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

import config
from api.routes import datasets, queries
from utils.logger import logger

# Create FastAPI app
app = FastAPI(
    title=config.API_TITLE,
    version=config.API_VERSION,
    description="Data Explorer API - Looker-like explore interface",
    debug=config.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(datasets.router)
app.include_router(queries.router)


@app.get("/", tags=["health"])
async def root():
    """Root endpoint - health check"""
    return {
        "status": "ok",
        "service": config.API_TITLE,
        "version": config.API_VERSION
    }


@app.get("/health", tags=["health"])
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": config.API_TITLE,
    }


if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting {config.API_TITLE} v{config.API_VERSION}")
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=config.DEBUG,
        log_level=config.LOG_LEVEL.lower()
    )
