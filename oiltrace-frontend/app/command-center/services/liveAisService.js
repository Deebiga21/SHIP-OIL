/**
 * Real-Time AISStream WebSocket Client & Multivessel Parser Service
 * Capped at MAX 200 tracked ships for optimal prototype performance.
 */

export const MAX_TRACKED_VESSELS = 200;

/**
 * Parses raw JSON string or object into standard vessel data objects (Capped at 200 vessels).
 */
export const parseAisApiResponse = (rawInput) => {
  if (!rawInput) return [];

  let parsedItems = [];

  if (typeof rawInput === 'object') {
    parsedItems = Array.isArray(rawInput) ? rawInput : [rawInput];
  } else if (typeof rawInput === 'string') {
    try {
      const single = JSON.parse(rawInput);
      parsedItems = Array.isArray(single) ? single : [single];
    } catch (e) {
      // Parse line-delimited JSON (NDJSON or multi-message stream logs)
      const lines = rawInput.split('\n');
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        let clean = trimmed;
        if (clean.includes('{') && clean.includes('}')) {
          clean = clean.substring(clean.indexOf('{'), clean.lastIndexOf('}') + 1);
        }

        try {
          const item = JSON.parse(clean);
          parsedItems.push(item);
        } catch (err) {
          // ignore invalid fragment
        }
      });
    }
  }

  const vesselMap = new Map();

  for (let idx = 0; idx < parsedItems.length; idx++) {
    const item = parsedItems[idx];
    if (!item) continue;

    // Ignore SubscriptionConfirmation or system messages without MetaData
    if (item.MessageType === 'SubscriptionConfirmation' || (!item.MetaData && !item.metadata && !item.Latitude)) {
      continue;
    }

    const meta = item.MetaData || item.metadata || item;
    const msgObj = item.Message || item.message || {};
    
    // Extract inner position report
    const posReport =
      msgObj.PositionReport ||
      msgObj.positionReport ||
      msgObj.StandardClassBPositionReport ||
      msgObj.ExtendedClassBPositionReport ||
      msgObj.ShipStaticData ||
      msgObj;

    const mmsi = meta.MMSI || meta.mmsi || posReport.UserID || posReport.userID || `mmsi_${idx + 1}`;
    let shipName = meta.ShipName || meta.shipName || meta.Ship_Name || posReport.Name || `VESSEL ${mmsi}`;
    shipName = String(shipName).trim();
    if (!shipName) shipName = `VESSEL ${mmsi}`;

    const lat = parseFloat(meta.latitude !== undefined ? meta.latitude : meta.Latitude !== undefined ? meta.Latitude : posReport.Latitude !== undefined ? posReport.Latitude : posReport.latitude || 0);
    const lng = parseFloat(meta.longitude !== undefined ? meta.longitude : meta.Longitude !== undefined ? meta.Longitude : posReport.Longitude !== undefined ? posReport.Longitude : posReport.longitude || 0);

    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) continue; // Skip invalid positions

    const sog = parseFloat(posReport.Sog !== undefined ? posReport.Sog : posReport.sog !== undefined ? posReport.sog : 0);
    const cog = parseFloat(posReport.Cog !== undefined ? posReport.Cog : posReport.cog !== undefined ? posReport.cog : posReport.TrueHeading || 0);
    const trueHeading = parseFloat(posReport.TrueHeading !== undefined ? posReport.TrueHeading : cog);
    const timestampStr = meta.time_utc || meta.timeUtc || meta.Timestamp || new Date().toISOString();
    const timestampMs = new Date(timestampStr).getTime() || Date.now();

    const trackPoint = {
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5)),
      speed: parseFloat(sog.toFixed(1)),
      course: parseFloat((cog > 0 ? cog : trueHeading).toFixed(1)),
      timestamp: timestampMs
    };

    if (!vesselMap.has(mmsi)) {
      if (vesselMap.size >= MAX_TRACKED_VESSELS) {
        // Capped at MAX 200 unique ships
        break;
      }
      vesselMap.set(mmsi, {
        id: `ais_${mmsi}`,
        name: shipName,
        mmsi: String(mmsi),
        imo: meta.IMO || meta.imo || 'N/A',
        flag: meta.Flag || meta.flag || '⚓ International',
        type: meta.ShipType || meta.shipType || 'Cargo / Tanker',
        dwt: meta.DWT || meta.dwt || 50000,
        lengthM: meta.Length || meta.length || 185,
        beamM: meta.Beam || meta.beam || 30,
        yearBuilt: meta.Year || 2020,
        destination: meta.Destination || meta.destination || 'In Transit',
        owner: 'Live AISStream',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
        trackHistory: [trackPoint]
      });
    } else {
      const existing = vesselMap.get(mmsi);
      existing.trackHistory.push(trackPoint);
      if (existing.name.startsWith('VESSEL') && !shipName.startsWith('VESSEL')) {
        existing.name = shipName;
      }
    }
  }

  return Array.from(vesselMap.values());
};

/**
 * Real-Time AISStream WebSocket Connection Manager (Limited to 200 active ships)
 */
export class RealtimeAisStream {
  constructor(apiKey, onVesselUpdate, onError) {
    this.apiKey = apiKey || import.meta.env.VITE_AIS_API_KEY || '46c21d2214962a440af47a06e6e0205040552897';
    this.onVesselUpdate = onVesselUpdate;
    this.onError = onError;
    this.socket = null;
    this.isConnected = false;
    this.vesselsMap = new Map();
    this.receivedCount = 0;
  }

  connect(boundingBoxes = [[[-40.0, 20.0], [30.0, 120.0]]]) {
    if (this.socket) {
      this.disconnect();
    }

    try {
      this.socket = new WebSocket('wss://stream.aisstream.io/v0/stream');

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log('🔗 Connected to AISStream WebSocket!');

        const subscribeMsg = {
          APIKey: this.apiKey,
          BoundingBoxes: boundingBoxes
        };

        this.socket.send(JSON.stringify(subscribeMsg));
      };

      this.socket.onmessage = async (event) => {
        try {
          let textData = '';
          if (typeof event.data === 'string') {
            textData = event.data;
          } else if (event.data instanceof Blob) {
            textData = await event.data.text();
          } else if (event.data instanceof ArrayBuffer) {
            textData = new TextDecoder().decode(event.data);
          } else {
            textData = String(event.data);
          }

          const raw = JSON.parse(textData);
          this.receivedCount++;

          const parsed = parseAisApiResponse(raw);
          if (parsed.length > 0) {
            parsed.forEach((v) => {
              if (this.vesselsMap.has(v.mmsi)) {
                const existing = this.vesselsMap.get(v.mmsi);
                existing.trackHistory.push(v.trackHistory[0]);
                if (existing.trackHistory.length > 25) existing.trackHistory.shift();
              } else if (this.vesselsMap.size < MAX_TRACKED_VESSELS) {
                // Enforce 200 vessel ceiling limit
                this.vesselsMap.set(v.mmsi, v);
              }
            });

            // Notify React listener with live array of streaming ships (max 200)
            if (this.onVesselUpdate) {
              this.onVesselUpdate(Array.from(this.vesselsMap.values()), this.receivedCount);
            }
          }
        } catch (err) {
          // ignore frame parse error
        }
      };

      this.socket.onerror = (err) => {
        console.error('AIS WebSocket Error:', err);
        if (this.onError) this.onError('WebSocket connection error.');
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        console.log('AISStream WebSocket Disconnected.');
      };
    } catch (e) {
      if (this.onError) this.onError('Failed to initiate WebSocket connection.');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }
}
