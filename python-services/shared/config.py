# Shared configuration for Python services

class Config:
    DEMO_MODE = True
    LOG_LEVEL = "INFO"
    
    # Service URLs
    DEMAND_FORECASTING_PORT = 8001
    ROUTE_OPTIMIZATION_PORT = 8002
    
    # API Configuration
    CORS_ORIGINS = ["*"]
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]

config = Config()