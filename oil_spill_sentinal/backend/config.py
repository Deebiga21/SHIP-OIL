import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or current directory
env_path = Path(__file__).resolve().parent.parent / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

AIS_API_KEY = os.getenv("VITE_AIS_API_KEY") or os.getenv("AIS_API_KEY") or "46c21d2214962a440af47a06e6e0205040552897"
OPENWEATHER_API_KEY = os.getenv("VITE_OPENWEATHER_API_KEY") or os.getenv("OPENWEATHER_API_KEY")
STORMGLASS_API_KEY = os.getenv("VITE_STORMGLASS_API_KEY") or os.getenv("STORMGLASS_API_KEY")
MARINE_WEATHER_API_KEY = os.getenv("VITE_MARINE_WEATHER_API_KEY") or os.getenv("MARINE_WEATHER_API_KEY")

PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "127.0.0.1")
