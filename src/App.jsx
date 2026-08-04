import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OutagePredictor from './components/OutagePredictor';
import DistrictHeatmap from './components/DistrictHeatmap';
import TrendAnalysis from './components/TrendAnalysis';
import ModelEvaluation from './components/ModelEvaluation';
import OutageLogs from './components/OutageLogs';
import { SOKOTO_DISTRICTS } from './services/mockDataGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');

  // Default prediction state
  const [predictParams, setPredictParams] = useState({
    districtId: 'sokoto_south',
    feederName: 'Runjin Sambo 11kV',
    hour: 14,
    season: 'Peak Dry Heat',
    weather: 'Extreme Heat >40°C',
    gridStatus: 'Scheduled Load Shedding',
    transformerHealth: 'Fair',
    recentMaintenance: false
  });

  // Simulated live sensor values
  const [liveGridStatus, setLiveGridStatus] = useState({
    frequency: '50.12',
    freqStatus: 'Normal',
    nationalGeneration: '4,150',
    sokotoLoad: '142',
    transmissionStatus: 'Operational'
  });

  // Subtle real-time fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const freqNum = (50.0 + (Math.random() * 0.3 - 0.15)).toFixed(2);
      const genNum = (4100 + Math.floor(Math.random() * 100)).toLocaleString();
      const loadNum = Math.floor(138 + Math.random() * 10);
      setLiveGridStatus({
        frequency: freqNum,
        freqStatus: freqNum < 49.8 ? 'Warning' : 'Normal',
        nationalGeneration: genNum,
        sokotoLoad: loadNum,
        transmissionStatus: freqNum < 49.8 ? 'Frequency Drag' : 'Operational'
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handler when user selects a district from Heatmap
  const handleSelectDistrictFromMap = (districtId) => {
    const districtObj = SOKOTO_DISTRICTS.find(d => d.id === districtId);
    if (districtObj) {
      setPredictParams(prev => ({
        ...prev,
        districtId: districtObj.id,
        feederName: districtObj.feeders[0] || prev.feederName
      }));
      setActiveTab('predictor');
    }
  };

  // Handler when user triggers a simulator scenario
  const handleSimulateEvent = (simParams) => {
    setPredictParams(prev => ({
      ...prev,
      ...simParams
    }));
    setActiveTab('predictor');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        liveGridStatus={liveGridStatus}
      />

      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.75rem 1rem' }}>
        {activeTab === 'predictor' && (
          <OutagePredictor 
            predictParams={predictParams} 
            setPredictParams={setPredictParams} 
          />
        )}

        {activeTab === 'heatmap' && (
          <DistrictHeatmap 
            onSelectDistrict={handleSelectDistrictFromMap} 
          />
        )}

        {activeTab === 'trends' && (
          <TrendAnalysis />
        )}

        {activeTab === 'evaluation' && (
          <ModelEvaluation />
        )}

        {activeTab === 'logs' && (
          <OutageLogs 
            onSimulateEvent={handleSimulateEvent} 
          />
        )}
      </main>

      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.7)', padding: '1.25rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', fontWeight: 500 }}>
        <p>⚡ VOLTCAST — Sokoto Electricity Outage Predictor | Powered by XGBoost Grid Ensemble & Historical Pattern Analysis</p>
      </footer>
    </div>
  );
}
