/**
 * Preset Real-world Satellite Scenarios for AquaSentinel AI Demonstration
 */

// Base reference timestamp (Current simulated observation time)
const NOW = Date.now();

export const PRESET_SCENARIOS = [
  {
    id: 'malacca_strait',
    title: 'Strait of Malacca - Illegal Tanker Discharge',
    subtitle: 'Dark ship event detected along major international crude transit lane',
    region: 'Strait of Malacca (Offshore Port Dickson)',
    satelliteMetadata: {
      satellite: 'Sentinel-1B SAR C-Band',
      acquisitionTime: NOW - 12 * 3600 * 1000, // 12 hours ago
      mode: 'IW Dual-Pol (VV + VH)',
      resolution: '10m',
      orbit: 'Pass 142 Descending',
      windSpeedKnots: 14,
      windDirDeg: 210, // SSW wind
      currentSpeedKnots: 1.4,
      currentDirDeg: 320 // NW ocean current
    },
    slickPolygon: [
      [2.6580, 101.8420],
      [2.6650, 101.8590],
      [2.6710, 101.8850],
      [2.6680, 101.8980],
      [2.6590, 101.8760],
      [2.6520, 101.8490]
    ],
    opticCode: 4, // Discontinuous True Color (Heavy Crude Sheen)
    vessels: [
      {
        id: 'vessel_malacca_1',
        name: 'MT OCEAN TITAN',
        imo: '9845120',
        mmsi: '538009123',
        flag: '🇲🇭 Marshall Islands',
        type: 'Crude Oil Tanker',
        dwt: 305000,
        lengthM: 333,
        beamM: 60,
        yearBuilt: 2019,
        destination: 'Singapore (ETA 18:00)',
        owner: 'Titan Ocean Maritime Inc.',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
        trackHistory: [
          { lat: 2.5100, lng: 101.6200, speed: 14.5, course: 125, timestamp: NOW - 18 * 3600 * 1000 },
          { lat: 2.5700, lng: 101.7100, speed: 14.1, course: 124, timestamp: NOW - 16 * 3600 * 1000 },
          { lat: 2.6180, lng: 101.7820, speed: 13.8, course: 122, timestamp: NOW - 14.5 * 3600 * 1000 },
          // SPEED DROP & AIS BLACKOUT START NEAR ORIGIN
          { lat: 2.6390, lng: 101.8150, speed: 3.2, course: 120, timestamp: NOW - 13.5 * 3600 * 1000 },
          // AIS BLACKOUT GAP (No signals for 2 hours)
          { lat: 2.6710, lng: 101.8700, speed: 4.1, course: 118, timestamp: NOW - 11.5 * 3600 * 1000 },
          { lat: 2.7300, lng: 101.9600, speed: 13.9, course: 121, timestamp: NOW - 9 * 3600 * 1000 },
          { lat: 2.8100, lng: 102.0800, speed: 14.2, course: 123, timestamp: NOW - 5 * 3600 * 1000 },
          { lat: 2.8900, lng: 102.2100, speed: 14.4, course: 125, timestamp: NOW }
        ]
      },
      {
        id: 'vessel_malacca_2',
        name: 'MSC BALTIC STAR',
        imo: '9723811',
        mmsi: '211394000',
        flag: '🇩🇪 Germany',
        type: 'Container Ship',
        dwt: 140000,
        lengthM: 366,
        beamM: 51,
        yearBuilt: 2017,
        destination: 'Tanjung Pelepas',
        owner: 'Mediterranean Shipping Co.',
        image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
        trackHistory: [
          { lat: 2.5400, lng: 101.6000, speed: 18.2, course: 128, timestamp: NOW - 18 * 3600 * 1000 },
          { lat: 2.6300, lng: 101.7400, speed: 18.5, course: 127, timestamp: NOW - 15 * 3600 * 1000 },
          { lat: 2.7200, lng: 101.8800, speed: 18.4, course: 128, timestamp: NOW - 12 * 3600 * 1000 },
          { lat: 2.8100, lng: 102.0200, speed: 18.1, course: 126, timestamp: NOW - 9 * 3600 * 1000 },
          { lat: 2.9000, lng: 102.1600, speed: 18.3, course: 127, timestamp: NOW - 6 * 3600 * 1000 },
          { lat: 2.9900, lng: 102.3000, speed: 18.0, course: 128, timestamp: NOW }
        ]
      },
      {
        id: 'vessel_malacca_3',
        name: 'MV PACIFIC TRADER',
        imo: '9456201',
        mmsi: '371204000',
        flag: '🇵🇦 Panama',
        type: 'Bulk Carrier',
        dwt: 75000,
        lengthM: 225,
        beamM: 32,
        yearBuilt: 2012,
        destination: 'Shanghai',
        owner: 'Pacific Bulk Shipping',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
        trackHistory: [
          { lat: 2.4800, lng: 101.6500, speed: 11.5, course: 122, timestamp: NOW - 18 * 3600 * 1000 },
          { lat: 2.5600, lng: 101.7700, speed: 11.8, course: 120, timestamp: NOW - 15 * 3600 * 1000 },
          { lat: 2.6400, lng: 101.8900, speed: 11.6, course: 121, timestamp: NOW - 12 * 3600 * 1000 },
          { lat: 2.7200, lng: 102.0100, speed: 11.4, course: 123, timestamp: NOW - 9 * 3600 * 1000 },
          { lat: 2.8000, lng: 102.1300, speed: 11.7, course: 122, timestamp: NOW }
        ]
      }
    ]
  },
  {
    id: 'north_sea',
    title: 'North Sea - Complex Offshore Flow',
    subtitle: 'Chemical sheen near energy platform corridor under strong tidal current',
    region: 'North Sea (Sector 56°N, 3°E)',
    satelliteMetadata: {
      satellite: 'Sentinel-1A SAR C-Band',
      acquisitionTime: NOW - 8 * 3600 * 1000,
      mode: 'IW Dual-Pol (VV + VH)',
      resolution: '10m',
      orbit: 'Pass 089 Ascending',
      windSpeedKnots: 22,
      windDirDeg: 270, // W wind
      currentSpeedKnots: 2.1,
      currentDirDeg: 45 // NE current
    },
    slickPolygon: [
      [56.4020, 3.2010],
      [56.4150, 3.2240],
      [56.4280, 3.2510],
      [56.4220, 3.2620],
      [56.4090, 3.2350],
      [56.3980, 3.2100]
    ],
    opticCode: 3, // Metallic Appearance
    vessels: [
      {
        id: 'vessel_ns_1',
        name: 'MT NORDIC STAR',
        imo: '9712040',
        mmsi: '257390000',
        flag: '🇳🇴 Norway (NIS)',
        type: 'Chemical / Product Tanker',
        dwt: 45000,
        lengthM: 183,
        beamM: 32,
        yearBuilt: 2018,
        destination: 'Rotterdam',
        owner: 'Nordic Tankers AS',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        trackHistory: [
          { lat: 56.3100, lng: 3.0500, speed: 13.1, course: 52, timestamp: NOW - 14 * 3600 * 1000 },
          { lat: 56.3650, lng: 3.1400, speed: 12.8, course: 50, timestamp: NOW - 11 * 3600 * 1000 },
          { lat: 56.3990, lng: 3.1950, speed: 3.1, course: 48, timestamp: NOW - 9 * 3600 * 1000 }, // SPEED DROP
          { lat: 56.4350, lng: 3.2500, speed: 12.9, course: 51, timestamp: NOW - 6 * 3600 * 1000 },
          { lat: 56.4900, lng: 3.3400, speed: 13.2, course: 53, timestamp: NOW }
        ]
      },
      {
        id: 'vessel_ns_2',
        name: 'SEA PIONEER',
        imo: '9651092',
        mmsi: '235091200',
        flag: '🇬🇧 United Kingdom',
        type: 'Tug / Offshore Support',
        dwt: 4200,
        lengthM: 88,
        beamM: 20,
        yearBuilt: 2015,
        destination: 'Ekofisk Field',
        owner: 'North Sea Offshore Services',
        image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
        trackHistory: [
          { lat: 56.4200, lng: 3.1000, speed: 9.8, course: 88, timestamp: NOW - 14 * 3600 * 1000 },
          { lat: 56.4220, lng: 3.2100, speed: 10.1, course: 85, timestamp: NOW - 10 * 3600 * 1000 },
          { lat: 56.4240, lng: 3.3200, speed: 9.9, course: 87, timestamp: NOW - 6 * 3600 * 1000 },
          { lat: 56.4260, lng: 3.4300, speed: 10.0, course: 86, timestamp: NOW }
        ]
      }
    ]
  },
  {
    id: 'persian_gulf',
    title: 'Persian Gulf - Heavy Crude Discharge',
    subtitle: 'Large continuous true color crude slick drifting towards sensitive coastal mangroves',
    region: 'Strait of Hormuz (Offshore Qeshm)',
    satelliteMetadata: {
      satellite: 'Sentinel-2B Optical + Sentinel-1 SAR',
      acquisitionTime: NOW - 6 * 3600 * 1000,
      mode: 'Multi-Spectral MSI + SAR IW',
      resolution: '10m Band 2,3,4,8',
      orbit: 'Pass 021 Descending',
      windSpeedKnots: 18,
      windDirDeg: 135, // SE wind
      currentSpeedKnots: 1.6,
      currentDirDeg: 300 // NW current
    },
    slickPolygon: [
      [26.3500, 55.4500],
      [26.3680, 55.4720],
      [26.3850, 55.5010],
      [26.3790, 55.5180],
      [26.3610, 55.4920],
      [26.3450, 55.4650]
    ],
    opticCode: 5, // Continuous True Color Heavy Crude
    vessels: [
      {
        id: 'vessel_pg_1',
        name: 'MT GULF SOVEREIGN',
        imo: '9918231',
        mmsi: '636019800',
        flag: '🇱🇷 Liberia',
        type: 'Crude Oil Tanker',
        dwt: 320000,
        lengthM: 339,
        beamM: 60,
        yearBuilt: 2021,
        destination: 'Fujairah Anchorage',
        owner: 'Gulf Carrier Corp.',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
        trackHistory: [
          { lat: 26.2200, lng: 55.2800, speed: 14.8, course: 55, timestamp: NOW - 12 * 3600 * 1000 },
          { lat: 26.2900, lng: 55.3700, speed: 14.4, course: 54, timestamp: NOW - 10 * 3600 * 1000 },
          // 110-MINUTE AIS BLACKOUT GAP
          { lat: 26.3420, lng: 55.4410, speed: 2.9, course: 52, timestamp: NOW - 8.2 * 3600 * 1000 },
          { lat: 26.4100, lng: 55.5300, speed: 14.1, course: 56, timestamp: NOW - 5 * 3600 * 1000 },
          { lat: 26.4800, lng: 55.6200, speed: 14.6, course: 55, timestamp: NOW }
        ]
      }
    ]
  }
];
