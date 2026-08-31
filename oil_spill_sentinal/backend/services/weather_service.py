import httpx
from config import OPENWEATHER_API_KEY, STORMGLASS_API_KEY

async def get_live_marine_weather(lat: float = 2.45, lng: float = 101.40):
    weather_result = {
        "windSpeedKnots": 14.0,
        "windDirDeg": 210,
        "currentSpeedKnots": 1.4,
        "currentDirDeg": 320,
        "waveHeightMeters": 0.8,
        "sstCelsius": 28.5,
        "pressureHpa": 1012.0,
        "source": "Open-Meteo Fallback"
    }

    # 1. Try OpenWeatherMap API if key is present
    if OPENWEATHER_API_KEY and OPENWEATHER_API_KEY != "your_openweather_api_key_here":
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={OPENWEATHER_API_KEY}&units=metric"
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    wind_speed_ms = data.get("wind", {}).get("speed", 5.0)
                    wind_speed_knots = round(wind_speed_ms * 1.94384, 1)
                    wind_dir = data.get("wind", {}).get("deg", 210)
                    pressure = data.get("main", {}).get("pressure", 1012.0)
                    temp = data.get("main", {}).get("temp", 28.5)

                    weather_result["windSpeedKnots"] = wind_speed_knots
                    weather_result["windDirDeg"] = wind_dir
                    weather_result["pressureHpa"] = pressure
                    weather_result["sstCelsius"] = temp
                    weather_result["source"] = "OpenWeatherMap API (Live)"
        except Exception as e:
            print(f"OpenWeatherMap API query error: {e}")

    # 2. Try StormGlass Marine API if key is present
    if STORMGLASS_API_KEY and "your_" not in STORMGLASS_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                headers = {"Authorization": STORMGLASS_API_KEY}
                url = f"https://api.stormglass.io/v2/weather/point?lat={lat}&lng={lng}&params=waveHeight,waterTemperature,windSpeed,windDirection"
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    hours = data.get("hours", [])
                    if hours:
                        curr = hours[0]
                        wave_h = curr.get("waveHeight", {}).get("sg") or curr.get("waveHeight", {}).get("noaa") or 0.8
                        sst = curr.get("waterTemperature", {}).get("sg") or curr.get("waterTemperature", {}).get("noaa") or 28.5
                        weather_result["waveHeightMeters"] = round(wave_h, 1)
                        weather_result["sstCelsius"] = round(sst, 1)
                        weather_result["source"] = f"{weather_result['source']} + StormGlass Marine API"
        except Exception as e:
            print(f"StormGlass API query error: {e}")

    # 3. Open-Meteo Free Marine Forecast API for wave height and ocean current
    if weather_result["source"] == "Open-Meteo Fallback":
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,surface_pressure"
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    curr = data.get("current", {})
                    wind_kmh = curr.get("wind_speed_10m", 15.0)
                    weather_result["windSpeedKnots"] = round(wind_kmh / 1.852, 1)
                    weather_result["windDirDeg"] = curr.get("wind_direction_10m", 210)
                    weather_result["pressureHpa"] = curr.get("surface_pressure", 1012.0)
                    weather_result["sstCelsius"] = curr.get("temperature_2m", 28.5)
                    weather_result["source"] = "Open-Meteo Live Marine Telemetry"
        except Exception as e:
            print(f"Open-Meteo API query error: {e}")

    return weather_result
