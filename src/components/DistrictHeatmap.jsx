import React, { useState, useEffect } from 'react';
import { getDynamicDistricts, subscribeDataChanges } from '../services/dataSyncEngine';
import { MapPin, Zap, AlertTriangle, ShieldCheck, Thermometer, ArrowRight } from 'lucide-react';

export default function DistrictHeatmap({ onSelectDistrict }) {
  const [districts, setDistricts] = useState(getDynamicDistricts);

  useEffect(() => {
    const unsubscribe = subscribeDataChanges(() => {
      setDistricts(getDynamicDistricts());
    });
    return () => unsubscribe();
  }, []);

  const getStatusBadge = (risk) => {
    if (risk >= 0.60) return <span className="badge badge-crimson">High Outage Risk</span>;
    if (risk >= 0.45) return <span className="badge badge-amber">Warning / Load Shedding</span>;
    return <span className="badge badge-emerald">Normal Grid Supply</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Title Banner */}
      <div className="glass-card" style={{ padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Sokoto Regional LGA District Grid Risk Heatmap
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Real-time thermal load stress matrix across 10 Local Government Areas (Auto-calibrated from uploaded dataset)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-emerald">Normal: 4 LGAs</span>
          <span className="badge badge-amber">Warning: 3 LGAs</span>
          <span className="badge badge-crimson">High Risk: 3 LGAs</span>
        </div>
      </div>

      {/* Grid of 10 Sokoto LGAs */}
      <div className="grid-heatmap">
        {districts.map(district => {
          const riskPct = Math.round(district.baselineRisk * 100);

          return (
            <div 
              key={district.id}
              className="glass-card glass-card-interactive"
              style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onClick={() => onSelectDistrict(district.id)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {district.type}
                  </span>
                  {getStatusBadge(district.baselineRisk)}
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={18} color="var(--liquid-cyan)" />
                  {district.name}
                </h3>

                <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CALIBRATED OUTAGE RISK</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: riskPct > 55 ? '#be123c' : '#0058be' }}>
                      {riskPct}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>AMBIENT TEMP</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {district.temp}°C
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.7)', padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  Primary Feeder: <b>{district.feeders[0]}</b>
                </div>
              </div>

              <button 
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1rem', justifyContent: 'center', fontSize: '0.825rem', padding: '0.5rem' }}
              >
                Analyze Risk Factors <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
