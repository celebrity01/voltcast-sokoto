import React from 'react';
import { Zap, Activity, ShieldCheck, MapPin, BarChart3, TestTube2, History } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, liveGridStatus }) {
  return (
    <header className="app-header">
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
              padding: '0.6rem',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.6)'
            }}>
              <Zap size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #0f172a, #0284c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  VOLTCAST
                </h1>
                <span className="badge badge-cyan">Sokoto Grid Engine</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Predicting Electricity Outage Probability from Historical & Weather Patterns
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button 
              className={`nav-tab ${activeTab === 'predictor' ? 'active' : ''}`}
              onClick={() => setActiveTab('predictor')}
            >
              <Zap size={16} /> Predictor
            </button>
            <button 
              className={`nav-tab ${activeTab === 'heatmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('heatmap')}
            >
              <MapPin size={16} /> District Heatmap
            </button>
            <button 
              className={`nav-tab ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              <BarChart3 size={16} /> Trend Analysis
            </button>
            <button 
              className={`nav-tab ${activeTab === 'evaluation' ? 'active' : ''}`}
              onClick={() => setActiveTab('evaluation')}
            >
              <TestTube2 size={16} /> Model Evaluation
            </button>
            <button 
              className={`nav-tab ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <History size={16} /> History & Logs
            </button>
          </nav>
        </div>

        {/* Live Grid Ticker */}
        <div className="ticker-bar">
          <div className="ticker-item" style={{ fontWeight: 700, color: 'var(--liquid-cyan)' }}>
            <Activity size={14} /> LIVE GRID SENSOR:
          </div>
          <div className="ticker-item">
            <span className={`status-dot ${liveGridStatus.freqStatus === 'Normal' ? 'green' : 'amber'}`}></span>
            Frequency: <strong style={{ color: 'var(--text-main)' }}>{liveGridStatus.frequency} Hz</strong>
          </div>
          <div className="ticker-item">
            National Generation: <strong style={{ color: 'var(--text-main)' }}>{liveGridStatus.nationalGeneration} MW</strong>
          </div>
          <div className="ticker-item">
            Sokoto Regional Load: <strong style={{ color: 'var(--text-main)' }}>{liveGridStatus.sokotoLoad} MW</strong>
          </div>
          <div className="ticker-item">
            Transmission Line: <span className="badge badge-emerald">{liveGridStatus.transmissionStatus}</span>
          </div>
          <div className="ticker-item" style={{ marginLeft: 'auto' }}>
            <ShieldCheck size={14} color="#059669" />
            <span style={{ color: 'var(--text-muted)' }}>Model v2.4 Active</span>
          </div>
        </div>

      </div>
    </header>
  );
}
