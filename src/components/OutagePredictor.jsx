import React, { useState } from 'react';
import { SOKOTO_DISTRICTS, FEEDERS } from '../services/mockDataGenerator';
import { calculateOutageProbability, getHistoricalPatternTrend } from '../services/predictionEngine';
import { getDynamicModelMetrics } from '../services/dataSyncEngine';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Zap, Clock, AlertTriangle, CloudSun, ShieldAlert, Cpu, Building2, Home, Hospital, CheckCircle2, Download, ArrowRightLeft, Sparkles, Calendar, TrendingUp, BarChart2, Activity, MapPin 
} from 'lucide-react';

export default function OutagePredictor({ predictParams, setPredictParams }) {
  const [compareMode, setCompareMode] = useState(false);
  const [compareDistrictId, setCompareDistrictId] = useState('wamako');
  const [activeTab, setActiveTab] = useState('prediction'); // 'prediction' | 'trend' | 'evaluation'

  const primaryResult = calculateOutageProbability(predictParams);
  const compareResult = calculateOutageProbability({
    ...predictParams,
    districtId: compareDistrictId
  });

  const historicalTrends = getHistoricalPatternTrend(predictParams.districtId);
  const evaluationMetrics = getDynamicModelMetrics(0.50);

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

  // Export Advisory Report Handler
  const handleExportReport = () => {
    const reportData = {
      title: "VOLTCAST Outage Risk & Historical Pattern Assessment Report",
      generatedAt: new Date().toISOString(),
      area: primaryResult.districtName,
      timeInput: `${predictParams.date || 'Today'} at ${predictParams.hour}:00 HRS`,
      outageProbability: `${primaryResult.probabilityPct}%`,
      riskLevel: primaryResult.riskLevel,
      historicalPatternDensity: primaryResult.historicalPatternIndex,
      estimatedDuration: `${primaryResult.estDurationHours} hrs`,
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

  const tooltipStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(203, 213, 225, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
    color: '#0f172a',
    fontWeight: '600'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* Top Section View Tabs Bar */}
      <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={22} color="var(--liquid-cyan)" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Predictive Outage & Historical Pattern Intelligence
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button 
            className={`nav-tab ${activeTab === 'prediction' ? 'active' : ''}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
            onClick={() => setActiveTab('prediction')}
          >
            <Cpu size={15} /> Area / Time Predictor
          </button>
          <button 
            className={`nav-tab ${activeTab === 'trend' ? 'active' : ''}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
            onClick={() => setActiveTab('trend')}
          >
            <TrendingUp size={15} /> Historical Pattern Trend View
          </button>
          <button 
            className={`nav-tab ${activeTab === 'evaluation' ? 'active' : ''}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
            onClick={() => setActiveTab('evaluation')}
          >
            <BarChart2 size={15} /> Model Evaluation
          </button>
        </div>
      </div>

      {/* Main Grid: Area/Time Input Controls + Outage Probability Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* Left Column: Area / Time Input Controls (5 Cols) */}
        <div className="glass-card" style={{ gridColumn: 'span 5', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--liquid-cyan)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Area & Time Selection
              </h3>
            </div>

            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem', background: compareMode ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.7)', borderColor: compareMode ? 'var(--liquid-cyan)' : 'rgba(203,213,225,0.8)', color: compareMode ? 'var(--liquid-cyan)' : 'var(--text-main)' }}
              onClick={() => setCompareMode(!compareMode)}
            >
              <ArrowRightLeft size={13} /> {compareMode ? 'Dual Compare' : 'Single Area'}
            </button>
          </div>

          {/* Area (LGA District) Input */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={14} /> Target Area (Sokoto LGA)
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
                <Sparkles size={14} /> Comparison Area B
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

          {/* Feeder Line Selector */}
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

          {/* Target Date Input */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} /> Target Date Input
            </label>
            <input 
              type="date"
              className="form-control"
              value={predictParams.date || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          {/* Target Time Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">
                <Clock size={14} /> Time Selection (Hour)
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 500 }}>
              <span>00:00 (Midnight)</span>
              <span>14:00 (Peak Heat)</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Environmental Parameters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label className="form-label">Season</label>
              <select 
                className="form-control"
                value={predictParams.season}
                onChange={(e) => handleInputChange('season', e.target.value)}
              >
                <option value="Peak Dry Heat">Peak Dry Heat (Mar-May)</option>
                <option value="Peak Rainy">Peak Rainy (Jul-Aug)</option>
                <option value="Harmattan">Harmattan (Nov-Feb)</option>
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
                <option value="Clear">Clear / Standard</option>
                <option value="Extreme Heat >40°C">Extreme Heat &gt;40°C</option>
                <option value="Severe Thunderstorm">Severe Thunderstorm</option>
                <option value="Harmattan Dust Storm">Harmattan Dust Storm</option>
              </select>
            </div>
          </div>

          {/* Export Report Action */}
          <button 
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            onClick={handleExportReport}
          >
            <Download size={15} /> Export Assessment Report (JSON)
          </button>
        </div>

        {/* Right Column: Dynamic Displays based on Active Tab (7 Cols) */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* TAB 1: Outage Probability Display & Driver Breakdown */}
          {activeTab === 'prediction' && (
            <>
              {/* Outage Probability Gauge Card */}
              <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <span className={`badge ${primaryResult.badgeColor}`}>
                      {primaryResult.riskLevel} Risk
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-main)' }}>
                      {compareMode ? `${primaryResult.districtName} vs ${compareResult.districtName}` : `${primaryResult.districtName} Outage Probability`}
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PATTERN INDEX</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--liquid-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <Activity size={14} /> {primaryResult.historicalPatternIndex}
                    </div>
                  </div>
                </div>

                {/* Gauge & Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: compareMode ? '1fr 1fr' : '200px 1fr', gap: '1.5rem', alignItems: 'center' }}>
                  
                  {/* Gauge Ring */}
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
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>
                        OUTAGE LIKELIHOOD
                      </div>
                    </div>
                  </div>

                  {/* Dual Compare Gauge or Metric Cards */}
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
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>
                          {compareResult.districtName}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.6rem', borderRadius: '12px', color: 'var(--liquid-cyan)' }}>
                          <Clock size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Est. Outage Duration</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{primaryResult.estDurationHours} Hours</div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '0.85rem 1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '0.6rem', borderRadius: '12px', color: 'var(--liquid-amber)' }}>
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Peak Disruption Risk Window</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{primaryResult.peakWindow}</div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Primary Outage Drivers */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Historical & Environmental Drivers Breakdown
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.25rem' }}>
                    {primaryResult.contributingFactors.map(factor => (
                      <div key={factor.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{factor.name}</span>
                          <span style={{ fontWeight: 800, color: factor.color }}>{factor.pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(226, 232, 240, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${factor.pct}%`, height: '100%', background: factor.color, transition: 'width 0.5s ease', borderRadius: '4px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actionable Recommendations Panel */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <ShieldAlert size={18} color="var(--liquid-amber)" />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Sector-Specific Action Plan
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--liquid-cyan)', fontWeight: 800, fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                      <Home size={15} /> Residential
                    </div>
                    <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {primaryResult.recommendations.residential}
                    </p>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--liquid-amber)', fontWeight: 800, fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                      <Building2 size={15} /> Commercial
                    </div>
                    <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {primaryResult.recommendations.commercial}
                    </p>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#be123c', fontWeight: 800, fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                      <Hospital size={15} /> Healthcare
                    </div>
                    <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {primaryResult.recommendations.healthcare}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Historical Pattern Trend View */}
          {activeTab === 'trend' && (
            <>
              {/* Monthly Historical Outage Trend Chart */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Monthly Historical Outage Pattern ({historicalTrends.districtName})
                    </h3>
                    <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                      Total incidents recorded across dry season heatwaves & seasonal transitions
                    </p>
                  </div>
                  <span className="badge badge-cyan">{historicalTrends.totalHistoricalIncidents} Incident Events</span>
                </div>

                <div style={{ height: '220px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalTrends.monthlyTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="outageGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0058be" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#0058be" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="outages" name="Outage Count" stroke="#0058be" strokeWidth={3} fillOpacity={1} fill="url(#outageGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 24-Hour Diurnal Pattern Curve */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
                  24-Hour Diurnal Outage Probability Curve ({historicalTrends.districtName})
                </h3>

                <div style={{ height: '200px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalTrends.diurnalTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                      <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="probability" name="Failure Risk %" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: Model Evaluation */}
          {activeTab === 'evaluation' && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Historical Validation & Model Evaluation
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Outage classifier evaluation metrics validated against {evaluationMetrics.totalRecordsProcessed} historical Sokoto grid records
                  </p>
                </div>
                <span className="badge badge-emerald">Accuracy: {evaluationMetrics.accuracy}%</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACCURACY</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#0058be', marginTop: '0.2rem' }}>
                    {evaluationMetrics.accuracy}%
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PRECISION</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                    {evaluationMetrics.precision}%
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RECALL</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginTop: '0.2rem' }}>
                    {evaluationMetrics.recall}%
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>F1 SCORE</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.2rem' }}>
                    {evaluationMetrics.f1Score}
                  </div>
                </div>
              </div>

              {/* Confusion Matrix Summary */}
              <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                  Historical Confusion Matrix (Validated Records)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', textTransform: 'center' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#047857' }}>TRUE POSITIVE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>{evaluationMetrics.confusionMatrix.tp}</div>
                  </div>
                  <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b45309' }}>FALSE POSITIVE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309' }}>{evaluationMetrics.confusionMatrix.fp}</div>
                  </div>
                  <div style={{ background: 'rgba(218, 52, 55, 0.15)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#be123c' }}>FALSE NEGATIVE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#be123c' }}>{evaluationMetrics.confusionMatrix.fn}</div>
                  </div>
                  <div style={{ background: 'rgba(14, 165, 233, 0.15)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0058be' }}>TRUE NEGATIVE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0058be' }}>{evaluationMetrics.confusionMatrix.tn}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
