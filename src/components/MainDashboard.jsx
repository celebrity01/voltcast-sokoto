import React, { useState } from 'react';
import GoogleMapView from './GoogleMapView';
import HourlyForecastTimeline from './HourlyForecastTimeline';
import { SOKOTO_DISTRICTS } from '../services/mockDataGenerator';
import { Sun, Droplets, Wind, Zap } from 'lucide-react';

export default function MainDashboard({ onNavigateToPredictor }) {
  const [selectedDistrictId, setSelectedDistrictId] = useState('sokoto_north');
  const [selectedHour, setSelectedHour] = useState(14);

  const selectedDistrict = SOKOTO_DISTRICTS.find(d => d.id === selectedDistrictId) || SOKOTO_DISTRICTS[0];
  const riskPct = Math.round(selectedDistrict.baselineRisk * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* Top Banner Ticker */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={20} color="var(--liquid-cyan)" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              VoltCast Forecast Command Center
            </h2>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
              Sokoto State Live GIS Map & High-Resolution Diurnal Forecast Matrix
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="badge badge-emerald">Live GIS Active</span>
          <button 
            className="btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
            onClick={() => onNavigateToPredictor(selectedDistrictId)}
          >
            Launch Deep Predictor
          </button>
        </div>
      </div>

      {/* Main Grid: Expansive Map (Left 8 Cols) + Current Conditions Side Panel (Right 4 Cols) */}
      <div className="main-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem', minHeight: '440px' }}>
        
        {/* Expansive Map (8 cols on desktop, 12 cols on mobile) */}
        <div className="map-container-col" style={{ gridColumn: 'span 8', minHeight: '440px', display: 'flex', flexDirection: 'column' }}>
          <GoogleMapView 
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
          />
        </div>

        {/* Current Conditions Side Panel (4 cols on desktop, 12 cols on mobile) */}
        <div className="glass-card side-panel-col" style={{ gridColumn: 'span 4', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Current Conditions
              </div>
              <span className="badge badge-cyan">{selectedDistrict.name}</span>
            </div>

            {/* Main Temperature & Big Icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1rem 0' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                  {selectedDistrict.temp}°C
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.3rem' }}>
                  {selectedDistrict.weather}
                </div>
              </div>
              <div style={{ background: 'rgba(0, 88, 190, 0.12)', padding: '1.1rem', borderRadius: '50%', boxShadow: '0 8px 25px rgba(0, 88, 190, 0.15)' }}>
                <Sun size={48} color="#0058be" />
              </div>
            </div>

            {/* Metrics List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '1.25rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.75)', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Droplets size={18} color="var(--liquid-cyan)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Humidity</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedDistrict.humidity}%</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Optimal</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.75)', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sun size={18} color="var(--liquid-amber)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>UV Index</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedDistrict.uvIndex}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--liquid-amber)', fontWeight: 700 }}>High</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.75)', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Wind size={18} color="var(--liquid-teal)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Wind Velocity</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedDistrict.wind}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Steady</div>
              </div>

            </div>
          </div>

          {/* Grid Risk Status Banner */}
          <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', borderRadius: '14px', background: riskPct > 55 ? 'rgba(218, 52, 55, 0.12)' : 'rgba(0, 88, 190, 0.12)', border: `1px solid ${riskPct > 55 ? 'rgba(218, 52, 55, 0.3)' : 'rgba(0, 88, 190, 0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>OUTAGE RISK LEVEL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: riskPct > 55 ? '#be123c' : '#0058be' }}>
                {riskPct}% ({riskPct > 55 ? 'HIGH RISK' : 'MODERATE'})
              </div>
            </div>
            <Zap size={22} color={riskPct > 55 ? '#be123c' : '#0058be'} />
          </div>

        </div>

      </div>

      {/* Bottom Panel — Detailed Hourly Forecast Timeline Carousel */}
      <HourlyForecastTimeline 
        selectedHour={selectedHour}
        onSelectHour={(h) => setSelectedHour(h)}
      />

    </div>
  );
}
