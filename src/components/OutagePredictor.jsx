import React, { useState } from 'react';
import { SOKOTO_DISTRICTS, FEEDERS } from '../services/mockDataGenerator';
import { calculateOutageProbability } from '../services/predictionEngine';
import { Zap, Clock, AlertTriangle, CloudSun, ShieldAlert, Cpu, Building2, Home, Hospital, CheckCircle2, Download, ArrowRightLeft, Sparkles } from 'lucide-react';

export default function OutagePredictor({ predictParams, setPredictParams }) {
  const [compareMode, setCompareMode] = useState(false);
  const [compareDistrictId, setCompareDistrictId] = useState('wamako');

  const primaryResult = calculateOutageProbability(predictParams);
  const compareResult = calculateOutageProbability({
    ...predictParams,
    districtId: compareDistrictId
  });

  const handleInputChange = (field, value) => {
    setPredictParams(prev => ({ ...prev, [field]: value }));
  };

  const getGaugeProps = (pct) => {
    let strokeColor = '#059669'; // emerald
    if (pct >= 75) strokeColor = '#e11d48'; // crimson
    else if (pct >= 50) strokeColor = '#d97706'; // amber
    else if (pct >= 30) strokeColor = '#0284c7'; // cyan
    const radius = 75;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (pct / 100) * circumference;
    return { strokeColor, radius, circumference, strokeDashoffset };
  };

  const primaryGauge = getGaugeProps(primaryResult.probabilityPct);
  const compareGauge = getGaugeProps(compareResult.probabilityPct);

  // Export Report Handler
  const handleExportReport = () => {
    const reportData = {
      title: "VOLTCAST Outage Risk Assessment Report",
      generatedAt: new Date().toISOString(),
      district: primaryResult.districtName,
      probability: `${primaryResult.probabilityPct}%`,
      riskLevel: primaryResult.riskLevel,
      estimatedDuration: primaryResult.estDurationHours,
      peakDisruptionWindow: primaryResult.peakWindow,
      advisories: primaryResult.recommendations,
      inputs: predictParams
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `Voltcast_Outage_Report_${primaryResult.districtName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
      
      {/* Input Parameters Panel (5 cols) */}
      <div className="glass-card" style={{ gridColumn: 'span 5', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={20} color="var(--liquid-cyan)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Prediction Parameters
            </h2>
          </div>

          {/* Mode Switcher */}
          <button 
            className="btn-secondary" 
            style={{ fontSize: '0.785rem', padding: '0.4rem 0.8rem', background: compareMode ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.7)', borderColor: compareMode ? 'var(--liquid-cyan)' : 'rgba(203,213,225,0.8)', color: compareMode ? 'var(--liquid-cyan)' : 'var(--text-main)' }}
            onClick={() => setCompareMode(!compareMode)}
          >
            <ArrowRightLeft size={14} /> {compareMode ? 'Dual Compare Mode' : 'Single District'}
          </button>
        </div>

        {/* Primary District Selector */}
        <div className="form-group">
          <label className="form-label">
            {compareMode ? 'Primary Sokoto District A' : 'Sokoto District / Area'}
          </label>
          <select 
            className="form-control"
            value={predictParams.districtId}
            onChange={(e) => handleInputChange('districtId', e.target.value)}
          >
            {SOKOTO_DISTRICTS.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
            ))}
          </select>
        </div>

        {/* Dual District Selector (Only in Compare Mode) */}
        {compareMode && (
          <div className="form-group" style={{ background: 'rgba(14, 165, 233, 0.08)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.25)' }}>
            <label className="form-label" style={{ color: 'var(--liquid-cyan)' }}>
              <Sparkles size={14} /> Comparison District B
            </label>
            <select 
              className="form-control"
              value={compareDistrictId}
              onChange={(e) => setCompareDistrictId(e.target.value)}
            >
              {SOKOTO_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
              ))}
            </select>
          </div>
        )}

        {/* Feeder Selector */}
        <div className="form-group">
          <label className="form-label">Feeder / Transmission Line</label>
          <select 
            className="form-control"
            value={predictParams.feederName}
            onChange={(e) => handleInputChange('feederName', e.target.value)}
          >
            {FEEDERS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Hour Slider */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label">
              <Clock size={14} /> Hour of Day
            </label>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--liquid-cyan)', fontSize: '0.95rem' }}>
              {predictParams.hour < 10 ? '0' + predictParams.hour : predictParams.hour}:00 HRS
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="23" 
            value={predictParams.hour} 
            onChange={(e) => handleInputChange('hour', parseInt(e.target.value, 10))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 500 }}>
            <span>00:00 (Midnight)</span>
            <span>12:00 (Noon)</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Season & Weather */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div className="form-group">
            <label className="form-label">Season Context</label>
            <select 
              className="form-control"
              value={predictParams.season}
              onChange={(e) => handleInputChange('season', e.target.value)}
            >
              <option value="Peak Dry Heat">Peak Dry Heat (Mar-May)</option>
              <option value="Peak Rainy">Peak Rainy (Jul-Aug)</option>
              <option value="Harmattan">Harmattan (Nov-Feb)</option>
              <option value="Standard Season">Standard Season</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <CloudSun size={14} /> Weather State
            </label>
            <select 
              className="form-control"
              value={predictParams.weather}
              onChange={(e) => handleInputChange('weather', e.target.value)}
            >
              <option value="Clear">Clear & Normal Temp</option>
              <option value="Extreme Heat >40°C">Extreme Heat &gt;40°C</option>
              <option value="Severe Thunderstorm / Heavy Rain">Severe Thunderstorm</option>
              <option value="Harmattan Dust Storm">Harmattan Dust Storm</option>
              <option value="High Humidity & Wind">High Humidity & Wind</option>
            </select>
          </div>
        </div>

        {/* Grid Status */}
        <div className="form-group">
          <label className="form-label">National Grid Supply Status</label>
          <select 
            className="form-control"
            value={predictParams.gridStatus}
            onChange={(e) => handleInputChange('gridStatus', e.target.value)}
          >
            <option value="Normal Grid Supply (>4500MW)">Normal Grid Supply (&gt;4500MW)</option>
            <option value="Scheduled Load Shedding">Scheduled Load Shedding</option>
            <option value="Critical Generation Deficit (<3000MW)">Critical Generation Deficit (&lt;3000MW)</option>
            <option value="Frequency Fluctuation (49.0 - 49.5 Hz)">Frequency Fluctuation (49.0 - 49.5 Hz)</option>
          </select>
        </div>

        {/* Transformer Health & Maintenance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div className="form-group">
            <label className="form-label">Transformer Condition</label>
            <select 
              className="form-control"
              value={predictParams.transformerHealth}
              onChange={(e) => handleInputChange('transformerHealth', e.target.value)}
            >
              <option value="Good">Good / Serviced</option>
              <option value="Fair">Fair / Standard</option>
              <option value="Poor / Overloaded">Poor / Overloaded</option>
            </select>
          </div>

          <div className="form-group" style={{ justifyContent: 'center' }}>
            <label className="form-label">Recent Maintenance</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.4rem', color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600 }}>
              <input 
                type="checkbox"
                checked={predictParams.recentMaintenance}
                onChange={(e) => handleInputChange('recentMaintenance', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--liquid-cyan)' }}
              />
              Maintained in last 48h
            </label>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          onClick={handleExportReport}
        >
          <Download size={16} /> Export Advisory Report (JSON)
        </button>

      </div>

      {/* Prediction Output & Risk Gauge (7 cols) */}
      <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Risk Probability Card */}
        <div className="glass-card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <span className={`badge badge-${primaryResult.badgeColor}`}>
                {primaryResult.riskLevel}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-main)' }}>
                {compareMode ? `${primaryResult.districtName} vs ${compareResult.districtName}` : `${primaryResult.districtName} Outage Assessment`}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence Score</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--liquid-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                <CheckCircle2 size={14} /> {primaryResult.confidenceInterval}
              </div>
            </div>
          </div>

          {/* Center Gauge & Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: compareMode ? '1fr 1fr' : '210px 1fr', gap: '2rem', alignItems: 'center' }}>
            
            {/* Primary Ring Gauge */}
            <div className="risk-gauge-container">
              <svg className="risk-gauge-svg" viewBox="0 0 180 180">
                <circle className="risk-gauge-bg" cx="90" cy="90" r={primaryGauge.radius} />
                <circle 
                  className="risk-gauge-val" 
                  cx="90" 
                  cy="90" 
                  r={primaryGauge.radius} 
                  stroke={primaryGauge.strokeColor}
                  strokeDasharray={primaryGauge.circumference}
                  strokeDashoffset={primaryGauge.strokeDashoffset}
                />
              </svg>
              <div className="risk-gauge-center">
                <div className="risk-gauge-number" style={{ color: primaryGauge.strokeColor }}>
                  {primaryResult.probabilityPct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {primaryResult.districtName}
                </div>
              </div>
            </div>

            {/* Second Ring Gauge if Compare Mode */}
            {compareMode ? (
              <div className="risk-gauge-container">
                <svg className="risk-gauge-svg" viewBox="0 0 180 180">
                  <circle className="risk-gauge-bg" cx="90" cy="90" r={compareGauge.radius} />
                  <circle 
                    className="risk-gauge-val" 
                    cx="90" 
                    cy="90" 
                    r={compareGauge.radius} 
                    stroke={compareGauge.strokeColor}
                    strokeDasharray={compareGauge.circumference}
                    strokeDashoffset={compareGauge.strokeDashoffset}
                  />
                </svg>
                <div className="risk-gauge-center">
                  <div className="risk-gauge-number" style={{ color: compareGauge.strokeColor }}>
                    {compareResult.probabilityPct}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {compareResult.districtName}
                  </div>
                </div>
              </div>
            ) : (
              /* Single Mode Metric Cards */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.65rem', borderRadius: '12px', color: 'var(--liquid-cyan)' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600 }}>Est. Outage Duration</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{primaryResult.estDurationHours}</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '0.65rem', borderRadius: '12px', color: 'var(--liquid-amber)' }}>
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600 }}>Peak Disruption Risk Window</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{primaryResult.peakWindow}</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Contributing Risk Factors Breakdown */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
            <h3 style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Primary Outage Drivers Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem 1.5rem' }}>
              {primaryResult.contributingFactors.map(factor => (
                <div key={factor.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{factor.name}</span>
                    <span style={{ fontWeight: 800, color: factor.color }}>{factor.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'rgba(226, 232, 240, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${factor.pct}%`, height: '100%', background: factor.color, transition: 'width 0.5s ease', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Actionable Recommendations Panel */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <ShieldAlert size={20} color="var(--liquid-amber)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Tailored Risk Advisories & Action Plans
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--liquid-cyan)', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <Home size={16} /> Residential
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {primaryResult.recommendations.residential}
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--liquid-amber)', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <Building2 size={16} /> Commercial
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {primaryResult.recommendations.commercial}
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '1.1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--liquid-crimson)', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <Hospital size={16} /> Healthcare & Critical
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {primaryResult.recommendations.healthcare}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
