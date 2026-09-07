import sys
import os

# Ensure the repository root is in Python's path so that 'backend.*' modules load seamlessly
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app

# Export app for Vercel Serverless Function runner
__all__ = ["app"]
