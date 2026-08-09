import React, { useState } from 'react';
import { RECENT_OUTAGE_LOGS, SOKOTO_DISTRICTS } from '../services/mockDataGenerator';
import { History, Search, Radio, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function OutageLogs({ onSimulateEvent, customLogs = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  // Combine default mock logs with user-uploaded or manually added custom logs
  const allLogs = [...customLogs, ...RECENT_OUTAGE_LOGS];

  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = (log.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (log.cause || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.feeder || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'ALL' || log.district === districtFilter;
    const matchesSeverity = severityFilter === 'ALL' || (log.riskSeverity || log.impact || 'Moderate') === severityFilter;
    return matchesSearch && matchesDistrict && matchesSeverity;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Severe': 
      case 'Critical': return <span className="badge badge-crimson">Severe</span>;
      case 'High': return <span className="badge badge-amber">High</span>;
      case 'Moderate': 
      case 'Medium': return <span className="badge badge-cyan">Moderate</span>;
      default: return <span className="badge badge-emerald">Low</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Interactive Grid Event Simulator Panel */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(240, 247, 255, 0.85))', border: '1px solid rgba(14, 165, 233, 0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Radio size={22} color="var(--liquid-cyan)" className="animate-pulse" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Live Grid Emergency Simulator
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Inject artificial grid anomalies or weather shocks to test real-time predictor response
              </p>
            </div>
          </div>
          <span className="badge badge-cyan">Simulator Ready</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <button 
            className="btn-secondary"
            style={{ border: '1px solid rgba(245, 158, 11, 0.4)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.85)' }}
            onClick={() => onSimulateEvent({
              weather: 'Extreme Heat >40°C',
              gridStatus: 'Scheduled Load Shedding',
              districtId: 'sokoto_south',
              transformerHealth: 'Poor / Overloaded'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 800, fontSize: '0.9rem' }}>
              <AlertTriangle size={16} /> Simulate Peak Heatwave Shock
            </div>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>
              43°C Heatwave in Sokoto South + Overloaded Feeder
            </span>
          </button>

          <button 
            className="btn-secondary"
            style={{ border: '1px solid rgba(225, 29, 72, 0.4)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.85)' }}
            onClick={() => onSimulateEvent({
              weather: 'Clear',
              gridStatus: 'Critical Generation Deficit (<3000MW)',
              districtId: 'wamako',
              transformerHealth: 'Fair'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#be123c', fontWeight: 800, fontSize: '0.9rem' }}>
              <Zap size={16} /> Simulate National Grid Drop
            </div>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>
              National Generation Collapse &lt;2800MW on Wamako Line
            </span>
          </button>

          <button 
            className="btn-secondary"
            style={{ border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.85)' }}
            onClick={() => onSimulateEvent({
              weather: 'Clear',
              gridStatus: 'Normal Grid Supply (>4500MW)',
              districtId: 'sokoto_north',
              transformerHealth: 'Good',
              recentMaintenance: true
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: 800, fontSize: '0.9rem' }}>
              <ShieldCheck size={16} /> Simulate Optimal Grid State
            </div>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)', textAlign: 'left', fontWeight: 500 }}>
              Full Generation + Serviced Feeder in Sokoto North
            </span>
          </button>

        </div>
      </div>

      {/* Historical Outage Log Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        
        {/* Table Filters Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={20} color="var(--liquid-cyan)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Recent Outage Incident Logs ({allLogs.length} Total)
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search log ID, cause..."
                className="form-control"
                style={{ paddingLeft: '2.2rem', fontSize: '0.825rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* District Filter */}
            <select 
              className="form-control" 
              style={{ width: '160px', fontSize: '0.825rem' }}
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="ALL">All Districts</option>
              {SOKOTO_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Severity Filter */}
            <select 
              className="form-control" 
              style={{ width: '140px', fontSize: '0.825rem' }}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All Severities</option>
              <option value="Severe">Severe</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
            </select>

          </div>
        </div>

        {/* Log Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.8)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>INCIDENT ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>DISTRICT</th>
                <th style={{ padding: '0.75rem 1rem' }}>FEEDER / LINE</th>
                <th style={{ padding: '0.75rem 1rem' }}>PRIMARY CAUSE</th>
                <th style={{ padding: '0.75rem 1rem' }}>DURATION</th>
                <th style={{ padding: '0.75rem 1rem' }}>TIMESTAMP</th>
                <th style={{ padding: '0.75rem 1rem' }}>SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.6)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--liquid-cyan)' }}>
                      {log.id || `INC-${idx + 1}`}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {log.district || log.District || 'Sokoto'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {log.feeder || log['Feeder Line'] || '11kV Feeder'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-main)', fontWeight: 500 }}>
                      {log.cause || log['Root Cause'] || 'Thermal Surge'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {log.duration || `${log['Duration (hrs)'] || 2} hrs`}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {log.time || log.date || log.Date || '2026-08-01'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {getSeverityBadge(log.riskSeverity || log.impact || log['Impact Level'] || 'Moderate')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No outage records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
