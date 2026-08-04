import React from 'react';
import { SOKOTO_DISTRICTS } from '../services/mockDataGenerator';
import { MapPin, ArrowRight } from 'lucide-react';

export default function DistrictHeatmap({ onSelectDistrict }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Normal':
        return <span className="badge badge-emerald">Normal Grid</span>;
      case 'Warning':
        return <span className="badge badge-amber">Grid Warning</span>;
      case 'Outage Risk':
        return <span className="badge badge-crimson">High Outage Risk</span>;
      default:
        return <span className="badge badge-cyan">Monitored</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <MapPin size={22} color="var(--liquid-cyan)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Sokoto State Grid & District Heatmap
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Real-time vulnerability monitor across 10 key Sokoto Local Government Areas & Power Corridors
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <span className="status-dot green"></span> Stable (4)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <span className="status-dot amber"></span> Elevated (3)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            <span className="status-dot red"></span> High Risk (3)
          </div>
        </div>
      </div>

      {/* Grid of Districts */}
      <div className="grid-heatmap">
        {SOKOTO_DISTRICTS.map(district => {
          const riskPct = Math.round(district.baselineRisk * 100);
          return (
            <div 
              key={district.id} 
              className="glass-card glass-card-interactive" 
              style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {district.name}
                  </h3>
                  {getStatusBadge(district.currentStatus)}
                </div>

                <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>
                  {district.type}
                </div>

                {/* Risk Bar */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Baseline Vulnerability</span>
                    <span style={{ fontWeight: 800, color: riskPct > 55 ? '#e11d48' : riskPct > 42 ? '#d97706' : '#059669' }}>
                      {riskPct}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'rgba(226, 232, 240, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${riskPct}%`, 
                        height: '100%', 
                        background: riskPct > 55 ? '#e11d48' : riskPct > 42 ? '#d97706' : '#059669',
                        borderRadius: '4px'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Primary Feeders */}
                <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-main)' }}>Key Feeders:</strong> {district.feeders.join(', ')}
                </div>
              </div>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.825rem' }}
                onClick={() => onSelectDistrict(district.id)}
              >
                Predict Outage <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
