import json
import asyncio
import websockets
from config import AIS_API_KEY

class AisStreamBridge:
    def __init__(self):
        self.api_key = AIS_API_KEY
        self.active_clients = set()
        self.vessels_map = {}
        self.is_connected = False
        self.received_count = 0

    async def register_client(self, websocket):
        self.active_clients.add(websocket)

    async def unregister_client(self, websocket):
        self.active_clients.remove(websocket)

    async def broadcast_to_clients(self, message_dict):
        if not self.active_clients:
            return
        payload = json.dumps(message_dict)
        disconnected = set()
        for client in self.active_clients:
            try:
                await client.send_text(payload)
            except Exception:
                disconnected.add(client)
        for client in disconnected:
            self.active_clients.remove(client)

    async def connect_to_aisstream(self, bounding_boxes=[[[-40.0, 20.0], [30.0, 120.0]]]):
        url = "wss://stream.aisstream.io/v0/stream"
        subscribe_msg = {
            "APIKey": self.api_key,
            "BoundingBoxes": bounding_boxes
        }

        while True:
            try:
                print(f"🔗 Python FastAPI connecting to AISStream WebSocket: {url}...")
                async with websockets.connect(url) as ws:
                    self.is_connected = True
                    await ws.send(json.dumps(subscribe_msg))

                    async for message in ws:
                        self.received_count += 1
                        try:
                            data = json.loads(message)
                            if data.get("MessageType") == "SubscriptionConfirmation":
                                continue

                            # Broadcast raw or parsed frame to React clients
                            await self.broadcast_to_clients({
                                "type": "AIS_POSITION_REPORT",
                                "count": self.received_count,
                                "payload": data
                            })
                        except Exception:
                            pass
            except Exception as e:
                print(f"AISStream WebSocket error: {e}. Retrying in 5 seconds...")
                self.is_connected = False
                await asyncio.sleep(5.0)

ais_bridge = AisStreamBridge()
