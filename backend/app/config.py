import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    PORT = int(os.getenv("PORT", "5000"))
    MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
    DB_NAME = os.getenv("DB_NAME", "hommed").strip()
    JWT_SECRET = os.getenv("JWT_SECRET", "").strip()
    CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN", "http://localhost:5173").strip()
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@hommed.com").strip().lower()
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123").strip()

    @staticmethod
    def validate():
        missing = []
        if not Config.MONGODB_URI:
            missing.append("MONGODB_URI")
        if not Config.JWT_SECRET:
            missing.append("JWT_SECRET")
        if missing:
            raise RuntimeError(
                f"Missing required environment variables: {', '.join(missing)}"
            )
