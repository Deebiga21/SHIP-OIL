(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/command-center/components/InteractiveMap.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InteractiveMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$command$2d$center$2f$utils$2f$geoUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/command-center/utils/geoUtils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Free Open Source Tile Layers (100% Free, NO API Key Required)
const TILE_SERVERS = {
    osm: {
        name: 'OpenStreetMap (Standard)',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc'
    },
    esriOcean: {
        name: 'Esri World Ocean',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, CEOS, UHO, and DeLorme',
        subdomains: []
    },
    cartoPositron: {
        name: 'Carto Positron Light',
        url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abc'
    }
};
function InteractiveMap({ scenario, slickData, hindcastData, forecastData, rankedVessels, selectedVesselId, onSelectVessel, currentTimeOffsetHours, layerToggles }) {
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapInstanceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const tileLayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const layersGroupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [activeTileServer, setActiveTileServer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('osm');
    // Initialize Map
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            if (!mapRef.current) return;
            if (!mapInstanceRef.current) {
                // Clamped bounds to prevent world repeating / looping on zoom out
                const worldBounds = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLngBounds(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLng(-85, -180), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLng(85, 180));
                const map = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(mapRef.current, {
                    zoomControl: false,
                    attributionControl: false,
                    worldCopyJump: false,
                    minZoom: 3,
                    maxZoom: 18,
                    maxBounds: worldBounds,
                    maxBoundsViscosity: 1.0 // Strictly locks viewport inside single world boundary
                }).setView([
                    2.66,
                    101.86
                ], 11);
                // Add Open-Source Tile Layer (noWrap prevents tile repetition)
                const initialServer = TILE_SERVERS.osm;
                const tileLayer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer(initialServer.url, {
                    maxZoom: 18,
                    minZoom: 3,
                    noWrap: true,
                    bounds: worldBounds,
                    subdomains: initialServer.subdomains,
                    attribution: initialServer.attribution
                }).addTo(map);
                // Zoom Control on Top Right
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].control.zoom({
                    position: 'topright'
                }).addTo(map);
                mapInstanceRef.current = map;
                tileLayerRef.current = tileLayer;
                layersGroupRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].layerGroup().addTo(map);
            }
        }
    }["InteractiveMap.useEffect"], []);
    // Handle Tile Server Switch
    const handleSwitchTileServer = (serverKey)=>{
        setActiveTileServer(serverKey);
        const map = mapInstanceRef.current;
        if (!map) return;
        if (tileLayerRef.current) {
            map.removeLayer(tileLayerRef.current);
        }
        const server = TILE_SERVERS[serverKey] || TILE_SERVERS.osm;
        const worldBounds = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLngBounds(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLng(-85, -180), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].latLng(85, 180));
        const newLayer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer(server.url, {
            maxZoom: 18,
            minZoom: 3,
            noWrap: true,
            bounds: worldBounds,
            subdomains: server.subdomains,
            attribution: server.attribution
        }).addTo(map);
        tileLayerRef.current = newLayer;
    };
    // Update Layers whenever scenario, time, or toggles change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            const map = mapInstanceRef.current;
            const layersGroup = layersGroupRef.current;
            if (!map || !layersGroup) return;
            layersGroup.clearLayers();
            // Calculate current time epoch for timeline playback
            const currentSimulatedTime = slickData.acquisitionTime + currentTimeOffsetHours * 3600 * 1000;
            // 1. Fit Map Bounds to Scenario
            if (slickData && slickData.centroid) {
                map.panTo(slickData.centroid, {
                    animate: true
                });
            }
            // 2. Render Oil Slick Polygon
            if (layerToggles.slickMask && scenario.slickPolygon) {
                const slickPoly = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].polygon(scenario.slickPolygon, {
                    color: '#0284C7',
                    weight: 2.5,
                    fillColor: '#0284C7',
                    fillOpacity: 0.45,
                    dashArray: '4, 4'
                }).addTo(layersGroup);
                slickPoly.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <div class="font-bold text-sky-700 uppercase tracking-wide">Sentinel-1 SAR Slick Detection</div>
          <div class="mt-1 text-slate-800"><b>Area:</b> ${slickData.areaKm2} kmÂ²</div>
          <div class="text-slate-800"><b>Volume:</b> ${slickData.volumeM3} mÂ³ (${slickData.volumeBarrels} bbls)</div>
          <div class="text-slate-800"><b>Class:</b> ${slickData.oilType}</div>
          <div class="text-slate-800"><b>Damping:</b> ${slickData.sarBackscatterDampingDb} dB</div>
        </div>
      `);
            }
            // 3. Render Hindcast Origin & Reverse Drift Trail
            if (layerToggles.hindcast && hindcastData) {
                // Reverse Trail Polyline
                const trailPoints = hindcastData.particleTrail.map({
                    "InteractiveMap.useEffect.trailPoints": (pt)=>[
                            pt.lat,
                            pt.lng
                        ]
                }["InteractiveMap.useEffect.trailPoints"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].polyline(trailPoints, {
                    color: '#DC2626',
                    weight: 3,
                    dashArray: '5, 8',
                    opacity: 0.9
                }).addTo(layersGroup);
                // Stochastic Particle Heat Cloud
                hindcastData.originHotspotParticles.forEach({
                    "InteractiveMap.useEffect": (p)=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].circleMarker([
                            p.lat,
                            p.lng
                        ], {
                            radius: 3.5,
                            color: '#DC2626',
                            fillColor: '#EF4444',
                            fillOpacity: 0.7,
                            weight: 0
                        }).addTo(layersGroup);
                    }
                }["InteractiveMap.useEffect"]);
                // Origin Centroid Marker (Pulsing Red)
                const originIcon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
                    className: 'custom-origin-icon',
                    html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute inline-flex w-full h-full rounded-full bg-rose-400/40 animate-ping"></span>
            <span class="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 border-2 border-white text-[10px] font-bold text-white shadow-md">
              ðŸŽ¯
            </span>
          </div>
        `,
                    iconSize: [
                        32,
                        32
                    ],
                    iconAnchor: [
                        16,
                        16
                    ]
                });
                const originMarker = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker(hindcastData.originCentroid, {
                    icon: originIcon
                }).addTo(layersGroup);
                originMarker.bindPopup(`
        <div class="p-2 font-sans text-xs">
          <div class="font-bold text-rose-700 uppercase tracking-wide">Target Spill Origin Hotspot</div>
          <div class="mt-1 text-slate-800"><b>Est. Release Time:</b> ${new Date(slickData.estimatedReleaseTime).toUTCString()}</div>
          <div class="text-slate-800"><b>Drift Age:</b> ${slickData.estimatedAgeHours} hours</div>
          <div class="text-slate-800"><b>Spatial Radius:</b> Â±${hindcastData.spatialUncertaintyRadiusKm} km</div>
        </div>
      `);
            }
            // 4. Render Forward Forecast Tube
            if (layerToggles.forecast && forecastData) {
                const forecastPoints = forecastData.forecastPath.map({
                    "InteractiveMap.useEffect.forecastPoints": (pt)=>[
                            pt.lat,
                            pt.lng
                        ]
                }["InteractiveMap.useEffect.forecastPoints"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].polyline(forecastPoints, {
                    color: '#059669',
                    weight: 2.5,
                    dashArray: '6, 6',
                    opacity: 0.9
                }).addTo(layersGroup);
                // End forecast point marker
                const endPt = forecastPoints[forecastPoints.length - 1];
                if (endPt) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].circleMarker(endPt, {
                        radius: 8,
                        color: '#059669',
                        fillColor: '#10B981',
                        fillOpacity: 0.4,
                        weight: 2
                    }).addTo(layersGroup);
                }
            }
            // 5. Render Vessels Tracks & Timeline Positions
            if (layerToggles.vessels && scenario.vessels) {
                scenario.vessels.forEach({
                    "InteractiveMap.useEffect": (vessel)=>{
                        const attributionInfo = rankedVessels.find({
                            "InteractiveMap.useEffect": (rv)=>rv.vesselId === vessel.id
                        }["InteractiveMap.useEffect"]) || {};
                        const isTopSuspect = attributionInfo.masterScore >= 80;
                        const isMediumSuspect = attributionInfo.masterScore >= 55 && attributionInfo.masterScore < 80;
                        const isSelected = vessel.id === selectedVesselId;
                        const trackPoints = vessel.trackHistory.map({
                            "InteractiveMap.useEffect.trackPoints": (pt)=>[
                                    pt.lat,
                                    pt.lng
                                ]
                        }["InteractiveMap.useEffect.trackPoints"]);
                        // Draw track line
                        const trackLineColor = isTopSuspect ? '#DC2626' : isMediumSuspect ? '#D97706' : '#0284C7';
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].polyline(trackPoints, {
                            color: trackLineColor,
                            weight: isSelected ? 4 : isTopSuspect ? 3 : 2,
                            opacity: isSelected ? 1 : 0.8
                        }).addTo(layersGroup);
                        // Highlight AIS Dark Gap if found
                        if (attributionInfo.darkShipGapFound && attributionInfo.gapNearOrigin) {
                            const sorted = [
                                ...vessel.trackHistory
                            ].sort({
                                "InteractiveMap.useEffect.sorted": (a, b)=>a.timestamp - b.timestamp
                            }["InteractiveMap.useEffect.sorted"]);
                            for(let i = 0; i < sorted.length - 1; i++){
                                if (sorted[i + 1].timestamp - sorted[i].timestamp > 30 * 60 * 1000) {
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].polyline([
                                        [
                                            sorted[i].lat,
                                            sorted[i].lng
                                        ],
                                        [
                                            sorted[i + 1].lat,
                                            sorted[i + 1].lng
                                        ]
                                    ], {
                                        color: '#D97706',
                                        weight: 4,
                                        dashArray: '4, 8',
                                        opacity: 1
                                    }).addTo(layersGroup).bindTooltip(`âš ï¸ AIS Transponder Blackout (${attributionInfo.gapDurationMinutes} mins)`, {
                                        permanent: false
                                    });
                                }
                            }
                        }
                        // Interpolate vessel position at current timeline time
                        const currentPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$command$2d$center$2f$utils$2f$geoUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolateVesselPosition"])(vessel.trackHistory, currentSimulatedTime);
                        if (currentPos) {
                            const markerColor = isTopSuspect ? '#DC2626' : isMediumSuspect ? '#D97706' : '#0284C7';
                            const vesselIcon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
                                className: 'vessel-marker-icon',
                                html: `
              <div class="relative flex items-center justify-center cursor-pointer transform hover:scale-125 transition-transform">
                <div class="w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'ring-4 ring-sky-500 bg-white' : 'bg-white border border-slate-300'} shadow-md" style="transform: rotate(${currentPos.course}deg)">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="${markerColor}" stroke="currentColor" stroke-width="1.5">
                    <polygon points="12 2 19 21 12 17 5 21 12 2"/>
                  </svg>
                </div>
                ${isTopSuspect ? `<span class="absolute -top-2 -right-2 px-1 py-0.5 bg-rose-600 text-[9px] font-bold text-white rounded-full shadow">ðŸš¨ ${attributionInfo.masterScore}%</span>` : ''}
              </div>
            `,
                                iconSize: [
                                    32,
                                    32
                                ],
                                iconAnchor: [
                                    16,
                                    16
                                ]
                            });
                            const marker = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                                currentPos.lat,
                                currentPos.lng
                            ], {
                                icon: vesselIcon
                            }).addTo(layersGroup);
                            marker.on('click', {
                                "InteractiveMap.useEffect": ()=>{
                                    onSelectVessel(vessel.id);
                                }
                            }["InteractiveMap.useEffect"]);
                            marker.bindPopup(`
            <div class="p-2 font-sans text-xs">
              <div class="font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                <span>${vessel.name}</span>
                <span class="ml-2 px-1.5 py-0.5 rounded text-[10px] ${isTopSuspect ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-sky-100 text-sky-800 border border-sky-300'}">${attributionInfo.masterScore}% Score</span>
              </div>
              <div class="mt-1 text-slate-700"><b>Type:</b> ${vessel.type} (${vessel.flag})</div>
              <div class="text-slate-700"><b>Speed:</b> ${currentPos.speed} knots | <b>Heading:</b> ${currentPos.course}Â°</div>
              <div class="text-slate-700"><b>CPA to Origin:</b> ${attributionInfo.cpaNm} nm</div>
              ${attributionInfo.darkShipGapFound ? `<div class="mt-1 text-amber-700 font-semibold">âš ï¸ AIS Blackout Detected (${attributionInfo.gapDurationMinutes}m)</div>` : ''}
            </div>
          `);
                        }
                    }
                }["InteractiveMap.useEffect"]);
            }
        }
    }["InteractiveMap.useEffect"], [
        scenario,
        slickData,
        hindcastData,
        forecastData,
        rankedVessels,
        selectedVesselId,
        currentTimeOffsetHours,
        layerToggles
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full h-full bg-[#EBF1F5] overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mapRef,
                className: "w-full h-full z-10"
            }, void 0, false, {
                fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                lineNumber: 311,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 left-4 z-20 flex flex-col space-y-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-panel p-3 rounded-xl border border-slate-200 text-xs w-60 shadow-lg bg-white/95 text-slate-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between font-mono",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "GIS Map Layers"
                                }, void 0, false, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping"
                                }, void 0, false, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                            lineNumber: 316,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5 font-medium mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center space-x-2 text-slate-700 cursor-pointer hover:text-sky-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: layerToggles.slickMask,
                                            onChange: (e)=>layerToggles.setSlickMask(e.target.checked),
                                            className: "rounded bg-white border-slate-300 text-sky-600 focus:ring-0"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 323,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2.5 h-2.5 rounded bg-sky-500 inline-block"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 329,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "SAR Slick Polygon"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 330,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 322,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center space-x-2 text-slate-700 cursor-pointer hover:text-rose-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: layerToggles.hindcast,
                                            onChange: (e)=>layerToggles.setHindcast(e.target.checked),
                                            className: "rounded bg-white border-slate-300 text-rose-600 focus:ring-0"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2.5 h-2.5 rounded bg-rose-600 inline-block"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 340,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Hindcast Origin Trail"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 341,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 333,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center space-x-2 text-slate-700 cursor-pointer hover:text-emerald-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: layerToggles.forecast,
                                            onChange: (e)=>layerToggles.setForecast(e.target.checked),
                                            className: "rounded bg-white border-slate-300 text-emerald-600 focus:ring-0"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 345,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2.5 h-2.5 rounded bg-emerald-600 inline-block"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 351,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Forecast Path (+72h)"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 344,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center space-x-2 text-slate-700 cursor-pointer hover:text-amber-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: layerToggles.vessels,
                                            onChange: (e)=>layerToggles.setVessels(e.target.checked),
                                            className: "rounded bg-white border-slate-300 text-amber-600 focus:ring-0"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 356,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-2.5 h-2.5 rounded bg-amber-500 inline-block"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 362,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "AIS Vessel Traffic"
                                        }, void 0, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 355,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-slate-200 pt-2 font-mono",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-[10px] text-slate-500 font-bold uppercase block mb-1",
                                    children: "Open-Source Basemap (Free)"
                                }, void 0, false, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: activeTileServer,
                                    onChange: (e)=>handleSwitchTileServer(e.target.value),
                                    className: "w-full bg-slate-50 border border-slate-300 text-slate-800 text-[11px] rounded p-1 font-sans cursor-pointer",
                                    children: Object.entries(TILE_SERVERS).map(([key, s])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: key,
                                            children: s.name
                                        }, key, false, {
                                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                            lineNumber: 378,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                                    lineNumber: 372,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                            lineNumber: 368,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                    lineNumber: 315,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/command-center/components/InteractiveMap.jsx",
        lineNumber: 309,
        columnNumber: 5
    }, this);
}
_s(InteractiveMap, "g6MPSIbxOTfHZpsPsWLlNfpZUho=");
_c = InteractiveMap;
var _c;
__turbopack_context__.k.register(_c, "InteractiveMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/command-center/components/InteractiveMap.jsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/command-center/components/InteractiveMap.jsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_command-center_components_InteractiveMap_jsx_1tb4y2d._.js.map