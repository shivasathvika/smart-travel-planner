import uvicorn
from backend.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL.lower(),
        # SSL configuration - uncomment for HTTPS
        # ssl_keyfile="./certs/key.pem",
        # ssl_certfile="./certs/cert.pem",
    )
