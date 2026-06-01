from pathlib import Path
import sys

# Make `backend/app` importable when running as a Vercel Function.
ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import create_app  # noqa: E402

app = create_app()
