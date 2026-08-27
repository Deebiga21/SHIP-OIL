import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import InteractiveMap from './components/InteractiveMap';
import TimelineControl from './components/TimelineControl';
import SlickDetailsCard from './components/SlickDetailsCard';
import SuspectVesselsList from './components/SuspectVesselsList';
import VesselDetailsModal from './components/VesselDetailsModal';
import SimulationPanel from './components/SimulationPanel';
import ReportModal from './components/ReportModal';

import { PRESET_SCENARIOS } from './data/presetScenarios';
import { characterizeOilSlick } from './engine/sarSegmentation';
import { runBackwardHindcast, runForwardForecast } from './engine/driftPhysics';
import { rankSuspectVessels } from './engine/vesselAttribution';

export default function App() {
  // Scenario Selection
  const [selectedScenarioId, setSelectedScenarioId] = useState('malacca_strait');
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  // Active Scenario object
  const activeScenario = useMemo(() => {
    return PRESET_SCENARIOS.find((s) => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Dynamic Physics Forcing States
  const [windSpeed, setWindSpeed] = useState(activeScenario.satelliteMetadata.windSpeedKnots);
  const [windDir, setWindDir] = useState(activeScenario.satelliteMetadata.windDirDeg);
  const [currentSpeed, setCurrentSpeed] = useState(activeScenario.satelliteMetadata.currentSpeedKnots);
  const [currentDir, setCurrentDir] = useState(activeScenario.satelliteMetadata.currentDirDeg);
  const [oilOpticCode, setOilOpticCode] = useState(activeScenario.opticCode || 4);

  // Synchronize physics vectors when scenario changes
  React.useEffect(() => {
    setWindSpeed(activeScenario.satelliteMetadata.windSpeedKnots);
    setWindDir(activeScenario.satelliteMetadata.windDirDeg);
    setCurrentSpeed(activeScenario.satelliteMetadata.currentSpeedKnots);
    setCurrentDir(activeScenario.satelliteMetadata.currentDirDeg);
    setOilOpticCode(activeScenario.opticCode || 4);
  }, [selectedScenarioId, activeScenario]);

  // Timeline Slider State (Hours relative to satellite pass acquisition time)
  const [currentTimeOffsetHours, setCurrentTimeOffsetHours] = useState(0);

  // Selected Vessel for Detail View
  const [selectedVesselId, setSelectedVesselId] = useState(null);
  const [vesselForModal, setVesselForModal] = useState(null);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSimulationPanelOpen, setIsSimulationPanelOpen] = useState(false);

  // GIS Layer Toggles
  const [slickMaskToggle, setSlickMaskToggle] = useState(true);
  const [hindcastToggle, setHindcastToggle] = useState(true);
  const [forecastToggle, setForecastToggle] = useState(true);
  const [vesselsToggle, setVesselsToggle] = useState(true);

  // 1. Characterize Oil Slick
  const slickData = useMemo(() => {
    return characterizeOilSlick(
      activeScenario.slickPolygon,
      oilOpticCode,
      activeScenario.satelliteMetadata.acquisitionTime
    );
  }, [activeScenario, oilOpticCode]);

  // 2. Compute Oceanographic Hindcast Physics
  const hindcastData = useMemo(() => {
    return runBackwardHindcast({
      slickCentroid: slickData.centroid,
      estimatedAgeHours: slickData.estimatedAgeHours,
      currentSpeedKnots: currentSpeed,
      currentDirDeg: currentDir,
      windSpeedKnots: windSpeed,
      windDirDeg: windDir
    });
  }, [slickData, currentSpeed, currentDir, windSpeed, windDir]);

  // 3. Compute Oceanographic Forecast Physics
  const forecastData = useMemo(() => {
    return runForwardForecast({
      slickCentroid: slickData.centroid,
      forecastHours: 48,
      currentSpeedKnots: currentSpeed,
      currentDirDeg: currentDir,
      windSpeedKnots: windSpeed,
      windDirDeg: windDir,
      initialVolumeM3: slickData.volumeM3
    });
  }, [slickData, currentSpeed, currentDir, windSpeed, windDir]);

  // 4. AIS Vessel Attribution Anomaly Scoring & Ranking
  const rankedVessels = useMemo(() => {
    return rankSuspectVessels(
      activeScenario.vessels,
      hindcastData.originCentroid,
      slickData.estimatedReleaseTime,
      hindcastData.driftVector
    );
  }, [activeScenario, hindcastData, slickData]);

  // Handle Default Physics Reset
  const handleResetSimulation = () => {
    setWindSpeed(activeScenario.satelliteMetadata.windSpeedKnots);
    setWindDir(activeScenario.satelliteMetadata.windDirDeg);
    setCurrentSpeed(activeScenario.satelliteMetadata.currentSpeedKnots);
    setCurrentDir(activeScenario.satelliteMetadata.currentDirDeg);
    setOilOpticCode(activeScenario.opticCode || 4);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F3F4F6] text-slate-800 overflow-hidden font-sans">
      {/* Navbar */}
      <Navbar
        scenarios={PRESET_SCENARIOS}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={(id) => {
          setSelectedScenarioId(id);
          setSelectedVesselId(null);
          setCurrentTimeOffsetHours(0);
        }}
        isSimulationMode={isSimulationMode}
        onToggleSimulationMode={() => setIsSimulationMode(!isSimulationMode)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenSimulationPanel={() => setIsSimulationPanelOpen(!isSimulationPanelOpen)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Map View */}
        <div className="flex-1 h-full relative">
          <InteractiveMap
            scenario={activeScenario}
            slickData={slickData}
            hindcastData={hindcastData}
            forecastData={forecastData}
            rankedVessels={rankedVessels}
            selectedVesselId={selectedVesselId}
            onSelectVessel={setSelectedVesselId}
            currentTimeOffsetHours={currentTimeOffsetHours}
            layerToggles={{
              slickMask: slickMaskToggle,
              setSlickMask: setSlickMaskToggle,
              hindcast: hindcastToggle,
              setHindcast: setHindcastToggle,
              forecast: forecastToggle,
              setForecast: setForecastToggle,
              vessels: vesselsToggle,
              setVessels: setVesselsToggle
            }}
          />

          {/* Floating Timeline Control at Bottom of Map */}
          <div className="absolute bottom-6 left-6 right-6 lg:right-96 z-20">
            <TimelineControl
              slickAcquisitionTime={slickData.acquisitionTime}
              currentTimeOffsetHours={currentTimeOffsetHours}
              onChangeTimeOffset={setCurrentTimeOffsetHours}
              minOffsetHours={-Math.max(24, slickData.estimatedAgeHours + 6)}
              maxOffsetHours={48}
            />
          </div>
        </div>

        {/* Right Sidebar Control Panels */}
        <aside className="w-full lg:w-96 bg-white/90 backdrop-blur-md border-l border-slate-200 p-4 space-y-4 overflow-y-auto z-20 hidden md:block">
          {/* Slick Details Card */}
          <SlickDetailsCard slickData={slickData} scenarioName={activeScenario.title} />

          {/* Suspect Vessels Leaderboard */}
          <SuspectVesselsList
            rankedVessels={rankedVessels}
            selectedVesselId={selectedVesselId}
            onSelectVessel={setSelectedVesselId}
            onInspectVessel={(vessel) => setVesselForModal(vessel)}
          />
        </aside>
      </div>

      {/* Slide-out Simulation Physics Panel */}
      <SimulationPanel
        isOpen={isSimulationPanelOpen}
        onClose={() => setIsSimulationPanelOpen(false)}
        windSpeed={windSpeed}
        setWindSpeed={setWindSpeed}
        windDir={windDir}
        setWindDir={setWindDir}
        currentSpeed={currentSpeed}
        setCurrentSpeed={setCurrentSpeed}
        currentDir={currentDir}
        setCurrentDir={setCurrentDir}
        oilOpticCode={oilOpticCode}
        setOilOpticCode={setOilOpticCode}
        onResetSimulation={handleResetSimulation}
      />

      {/* Vessel Forensic Details Modal */}
      {vesselForModal && (
        <VesselDetailsModal
          vesselInfo={vesselForModal}
          onClose={() => setVesselForModal(null)}
          originTimestamp={slickData.estimatedReleaseTime}
        />
      )}

      {/* Printable Investigation Audit Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        scenario={activeScenario}
        slickData={slickData}
        hindcastData={hindcastData}
        rankedVessels={rankedVessels}
      />
    </div>
  );
}
