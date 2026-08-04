import React, { useState } from 'react';
import GoogleMapView from './GoogleMapView';
import HourlyForecastTimeline from './HourlyForecastTimeline';
import { SOKOTO_DISTRICTS } from '../services/mockDataGenerator';
import { 
  Sun, Droplets, Wind, Zap, ShieldAlert, Activity, Gauge, Navigation, Thermometer, Radio, CheckCircle2, AlertTriangle, ArrowUpRight 
} from 'lucide-react';

export default function MainDashboard({ onNavigateToPredictor }) {
  const [selectedDistrictId, setSelectedDistrictId] = useState('sokoto_north');
  const [selectedHour, setSelectedHour] = useState(14);

  const selectedDistrict = SOKOTO_DISTRICTS.find(d => d.id === selectedDistrictId) || SOKOTO_DISTRICTS[0];
  const riskPct = Math.round(selectedDistrict.baselineRisk * 100);

  // Feeder status list for Sokoto region
  const feederStatuses = [
    { name: 'Runjin Sambo 11kV', status: 'ONLINE', load: '64%', risk: 'Low' },
    { name: 'Guiwa 33kV Line', status: 'HIGH TEMP', load: '89%', risk: 'High' },
    { name: 'Sultan Palace 11kV', status: 'ONLINE', load: '45%', risk: 'Low' },
    { name: 'Giginya 33kV Trunk', status: 'LOAD SHEDDING', load: '94%', risk: 'Critical' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* 1. High-Tech Glass Header Banner & Live Status Ticker */}
      <div className="glass-card" style={{ padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(240,249,255,0.75))' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0058be, #06b6d4)',
            padding: '0.75rem',
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(0, 88, 190, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                VoltCast Regional Command Center
              </h2>
              <span className="badge badge-emerald">
                <Radio size={12} className="animate-pulse" /> Live Telemetry
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.15rem' }}>
              Sokoto Regional Grid Stability Monitor • Real-time Thermal Stress & Diurnal Outage Risk
            </p>
          </div>
        </div>

        {/* Action Button & Grid Health Metric */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right', display: 'none', mdDisplay: 'block' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>GRID SYSTEM FREQUENCY</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
              50.02 Hz <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)' }}>(Nominal)</span>
            </div>
          </div>

          <button 
            className="btn-primary"
            style={{ fontSize: '0.875rem', padding: '0.65rem 1.25rem' }}
            onClick={() => onNavigateToPredictor(selectedDistrictId)}
          >
            Launch Deep Predictor <ArrowUpRight size={16} />
          </button>
        </div>

      </div>

      {/* 2. Interactive Sokoto LGA Selection Pills Bar */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <span style={{ fontSize: '0.785rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', paddingRight: '0.4rem' }}>
          Select Region:
        </span>
        {SOKOTO_DISTRICTS.map((district) => {
          const isSelected = district.id === selectedDistrictId;
          const dRisk = Math.round(district.baselineRisk * 100);
          return (
            <button
              key={district.id}
              onClick={() => setSelectedDistrictId(district.id)}
              style={{
                flex: '0 0 auto',
                background: isSelected ? 'linear-gradient(135deg, #0058be, #0284c7)' : 'rgba(255, 255, 255, 0.75)',
                color: isSelected ? '#ffffff' : 'var(--text-main)',
                border: `1px solid ${isSelected ? '#0058be' : 'rgba(226, 232, 240, 0.8)'}`,
                borderRadius: '9999px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 15px rgba(0, 88, 190, 0.25)' : 'none'
              }}
            >
              <span>{district.name}</span>
              <span style={{
                background: isSelected ? 'rgba(255, 255, 255, 0.25)' : (dRisk > 55 ? 'rgba(218, 52, 55, 0.15)' : 'rgba(0, 88, 190, 0.12)'),
                color: isSelected ? '#ffffff' : (dRisk > 55 ? '#be123c' : '#0058be'),
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 800
              }}>
                {dRisk}% Risk
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Dashboard Body: Expansive GIS Map (Left 8 Cols) + Live Weather Side Panel (Right 4 Cols) */}
      <div className="main-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem', minHeight: '460px' }}>
        
        {/* Expansive Interactive Map Container (8 Cols on Desktop) */}
        <div className="map-container-col" style={{ gridColumn: 'span 8', minHeight: '460px', display: 'flex', flexDirection: 'column' }}>
          <GoogleMapView 
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
          />
        </div>

        {/* Current Weather & Grid Status Side Panel (4 Cols on Desktop) */}
        <div className="glass-card side-panel-col" style={{ gridColumn: 'span 4', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div>
            {/* Location Title Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Target LGA Telemetry
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                  {selectedDistrict.name}
                </div>
              </div>
              <span className={`badge ${riskPct > 55 ? 'badge-crimson' : 'badge-cyan'}`}>
                {selectedDistrict.type}
              </span>
            </div>

            {/* Main Temperature & Weather Icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.75rem 0 1.25rem 0' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.6rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                  {selectedDistrict.temp}°C
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Thermometer size={16} color="var(--liquid-amber)" />
                  {selectedDistrict.weather}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 88, 190, 0.15), rgba(6, 182, 212, 0.15))',
                padding: '1.25rem',
                borderRadius: '50%',
                boxShadow: '0 8px 25px rgba(0, 88, 190, 0.15)',
                border: '1px solid rgba(0, 88, 190, 0.25)'
              }}>
                <Sun size={48} color="#0058be" />
              </div>
            </div>

            {/* Real-Time Environmental Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              
              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.75rem 0.85rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Droplets size={15} color="var(--liquid-cyan)" /> Humidity
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {selectedDistrict.humidity}%
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.75rem 0.85rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Sun size={15} color="var(--liquid-amber)" /> UV Index
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {selectedDistrict.uvIndex} <span style={{ fontSize: '0.7rem', color: 'var(--liquid-amber)', fontWeight: 700 }}>(High)</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.75rem 0.85rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Wind size={15} color="var(--liquid-teal)" /> Wind Speed
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {selectedDistrict.wind}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '0.75rem 0.85rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Activity size={15} color="var(--liquid-violet)" /> Thermal Stress
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {selectedDistrict.temp > 38 ? 'High' : 'Moderate'}
                </div>
              </div>

            </div>
          </div>

          {/* Liquid Probability Outage Banner */}
          <div style={{ 
            marginTop: '1.25rem', 
            padding: '1rem', 
            borderRadius: '16px', 
            background: riskPct > 55 ? 'linear-gradient(135deg, rgba(218, 52, 55, 0.12), rgba(225, 29, 72, 0.08))' : 'linear-gradient(135deg, rgba(0, 88, 190, 0.12), rgba(6, 182, 212, 0.08))', 
            border: `1px solid ${riskPct > 55 ? 'rgba(218, 52, 55, 0.35)' : 'rgba(0, 88, 190, 0.35)'}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  PREDICTED OUTAGE LIKELIHOOD
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: riskPct > 55 ? '#be123c' : '#0058be', marginTop: '0.1rem' }}>
                  {riskPct}% ({riskPct > 55 ? 'HIGH RISK' : 'MODERATE'})
                </div>
              </div>
              <div style={{
                background: riskPct > 55 ? '#da3437' : '#0058be',
                padding: '0.5rem',
                borderRadius: '50%',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <ShieldAlert size={22} />
              </div>
            </div>

            {/* Liquid Progress Bar */}
            <div style={{ width: '100%', height: '7px', background: 'rgba(226, 232, 240, 0.8)', borderRadius: '9999px', marginTop: '0.75rem', overflow: 'hidden' }}>
              <div style={{
                width: `${riskPct}%`,
                height: '100%',
                background: riskPct > 55 ? 'linear-gradient(90deg, #da3437, #be123c)' : 'linear-gradient(90deg, #0058be, #06b6d4)',
                borderRadius: '9999px',
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>

        </div>

      </div>

      {/* 4. Sokoto Feeder Telemetry Strip */}
      <div className="glass-card" style={{ padding: '1.1rem 1.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--liquid-cyan)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Substation Feeder Telemetry Matrix
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>4 Primary Transmission Lines</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {feederStatuses.map((feeder, i) => (
            <div key={i} style={{ padding: '0.75rem 0.9rem', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-main)' }}>{feeder.name}</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Transformer Load: <b>{feeder.load}</b></div>
              </div>
              <span className={`badge ${feeder.status === 'ONLINE' ? 'badge-emerald' : (feeder.status === 'HIGH TEMP' ? 'badge-amber' : 'badge-crimson')}`} style={{ fontSize: '0.675rem', padding: '0.2rem 0.55rem' }}>
                {feeder.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Detailed Diurnal Hourly Forecast Timeline Carousel */}
      <HourlyForecastTimeline 
        selectedHour={selectedHour}
        onSelectHour={(h) => setSelectedHour(h)}
      />

    </div>
  );
}
