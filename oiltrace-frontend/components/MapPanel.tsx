"use client";

import { useState, useMemo } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Layers } from 'lucide-react';

// Replace with a real Mapbox token via env var later
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2xhY2NoY3Z1MDFtaTNxbXQ0YnRnYnZjMSJ9.mocktoken";

interface MapPanelProps {
  demoState: number;
}

export function MapPanel({ demoState }: MapPanelProps) {
  const [viewState, setViewState] = useState({
    longitude: 80.182,
    latitude: 13.245,
    zoom: 10,
    pitch: 45,
    bearing: 0
  });

  // Mock data for the incident
  const spillPolygon = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [80.178, 13.249],
              [80.186, 13.246],
              [80.185, 13.241],
              [80.176, 13.242],
              [80.178, 13.249],
            ]
          ]
        }
      }
    ]
  }), []);

  const originZone = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [80.115, 13.205],
              [80.128, 13.203],
              [80.126, 13.196],
              [80.113, 13.198],
              [80.115, 13.205],
            ]
          ]
        }
      }
    ]
  }), []);

  const driftPath = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.121, 13.201], // Origin
            [80.135, 13.215],
            [80.155, 13.230],
            [80.182, 13.245], // Spill centroid
          ]
        }
      }
    ]
  }), []);

  const vesselTrack = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { type: 'gap' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.100, 13.180],
            [80.110, 13.190],
          ]
        }
      },
      {
        type: 'Feature',
        properties: { type: 'active' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.110, 13.190], // Gap start
            [80.130, 13.210], // Gap end (passes through origin)
          ]
        }
      },
      {
        type: 'Feature',
        properties: { type: 'active' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [80.130, 13.210],
            [80.160, 13.240],
            [80.200, 13.280],
          ]
        }
      }
    ]
  }), []);

  return (
    <div className="relative w-full h-full rounded border border-[var(--panel-border)] overflow-hidden bg-[#030c14]">
      {/* Fallback pattern if token fails or while loading */}
      <div className="absolute inset-0 radar-sweep opacity-20" />
      
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />

        {/* Layer 1: Spill Polygon (Demo State >= 3) */}
        {demoState >= 3 && (
          <Source id="spill" type="geojson" data={spillPolygon as any}>
            <Layer 
              id="spill-fill" 
              type="fill" 
              paint={{
                'fill-color': '#ef4444',
                'fill-opacity': 0.4
              }} 
            />
            <Layer 
              id="spill-line" 
              type="line" 
              paint={{
                'line-color': '#ef4444',
                'line-width': 2
              }} 
            />
          </Source>
        )}

        {/* Layer 2: Origin Zone (Demo State >= 6) */}
        {demoState >= 6 && (
          <Source id="origin" type="geojson" data={originZone as any}>
            <Layer 
              id="origin-fill" 
              type="fill" 
              paint={{
                'fill-color': '#0ea5e9',
                'fill-opacity': 0.2
              }} 
            />
            <Layer 
              id="origin-line" 
              type="line" 
              paint={{
                'line-color': '#0ea5e9',
                'line-width': 2,
                'line-dasharray': [2, 2]
              }} 
            />
          </Source>
        )}

        {/* Layer 3: Drift Path (Demo State >= 5) */}
        {demoState >= 5 && (
          <Source id="drift" type="geojson" data={driftPath as any}>
            <Layer 
              id="drift-line" 
              type="line" 
              paint={{
                'line-color': '#38bdf8',
                'line-width': 3,
                'line-opacity': 0.8
              }} 
            />
          </Source>
        )}

        {/* Layer 4: Vessel Track (Demo State >= 7) */}
        {demoState >= 7 && (
          <Source id="vessel" type="geojson" data={vesselTrack as any}>
            <Layer 
              id="vessel-line-active" 
              type="line" 
              filter={['==', 'type', 'active']}
              paint={{
                'line-color': '#ffffff',
                'line-width': 2
              }} 
            />
            <Layer 
              id="vessel-line-gap" 
              type="line" 
              filter={['==', 'type', 'gap']}
              paint={{
                'line-color': '#f59e0b',
                'line-width': 2,
                'line-dasharray': [4, 4]
              }} 
            />
          </Source>
        )}
      </Map>

      {/* Overlays */}
      <div className="absolute top-4 left-4 glass-panel p-2 rounded flex items-center gap-2">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono">MAP LAYERS</span>
      </div>
    </div>
  );
}
