import sys
import os

# Add current dir
sys.path.append(os.path.dirname(__file__))

try:
    # ✅ Vercel (root execution)
    from api.main import app
except ModuleNotFoundError:
    # ✅ Local dev (inside /api)
    from main import app