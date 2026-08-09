import React, { useState } from 'react';
import SidebarNav from './components/SidebarNav';
import MainDashboard from './components/MainDashboard';
import OutagePredictor from './components/OutagePredictor';
import DistrictHeatmap from './components/DistrictHeatmap';
import AnalyticsView from './components/AnalyticsView';
import ModelEvaluation from './components/ModelEvaluation';
import OutageLogs from './components/OutageLogs';
import DataUploader from './components/DataUploader';
import AiAssistant from './components/AiAssistant';
import { SOKOTO_DISTRICTS } from './services/mockDataGenerator';
import { LayoutDashboard, Zap, MapPin, BarChart3, TestTube2, History, UploadCloud, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customUploadedLogs, setCustomUploadedLogs] = useState([]);

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

  const handleBatchDataUploaded = (newRecords) => {
    setCustomUploadedLogs(prev => [...newRecords, ...prev]);
    setActiveTab('logs');
  };

  const handleAddManualLog = (newLog) => {
    setCustomUploadedLogs(prev => [newLog, ...prev]);
    setActiveTab('logs');
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'Command', icon: LayoutDashboard },
    { id: 'predictor', label: 'Predictor', icon: Zap },
    { id: 'ai', label: 'AI Copilot', icon: Bot },
    { id: 'upload', label: 'Upload', icon: UploadCloud },
    { id: 'logs', label: 'Logs', icon: History },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      
      {/* Desktop Left Glass Sidebar Navigation */}
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
            customLogs={customUploadedLogs}
          />
        )}

        {activeTab === 'upload' && (
          <DataUploader 
            onDataUploaded={handleBatchDataUploaded}
            onAddManualLog={handleAddManualLog}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistant />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on Mobile View <= 768px) */}
      <nav className="mobile-bottom-nav">
        {mobileNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
