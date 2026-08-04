import React, { useState } from 'react';
import SidebarNav from './components/SidebarNav';
import MainDashboard from './components/MainDashboard';
import OutagePredictor from './components/OutagePredictor';
import DistrictHeatmap from './components/DistrictHeatmap';
import AnalyticsView from './components/AnalyticsView';
import ModelEvaluation from './components/ModelEvaluation';
import OutageLogs from './components/OutageLogs';
import { SOKOTO_DISTRICTS } from './services/mockDataGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const handleNavigateToPredictor = (districtId) => {
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

  const handleSimulateEvent = (simParams) => {
    setPredictParams(prev => ({
      ...prev,
      ...simParams
    }));
    setActiveTab('predictor');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      
      {/* Left Glass Sidebar Navigation (Matching Image 1 & 2) */}
      <SidebarNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Command Center Viewport */}
      <main style={{ flex: 1, padding: '1.5rem 1.75rem', overflowY: 'auto', minWidth: 0 }}>
        {activeTab === 'dashboard' && (
          <MainDashboard 
            onNavigateToPredictor={handleNavigateToPredictor}
          />
        )}

        {activeTab === 'predictor' && (
          <OutagePredictor 
            predictParams={predictParams} 
            setPredictParams={setPredictParams} 
          />
        )}

        {activeTab === 'heatmap' && (
          <DistrictHeatmap 
            onSelectDistrict={handleNavigateToPredictor} 
          />
        )}

        {activeTab === 'trends' && (
          <AnalyticsView />
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

    </div>
  );
}
