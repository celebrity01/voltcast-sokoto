import React, { useState } from 'react';
import { 
  ANALYTICS_TEMP_COMPARISON, 
  ANALYTICS_PRECIPITATION, 
  WIND_ROSE_DATA 
} from '../services/mockDataGenerator';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { BarChart3, Filter, Thermometer, CloudRain, Wind, ShieldCheck } from 'lucide-react';

export default function AnalyticsView() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [dataType, setDataType] = useState('Temperature, Outage Risk, Wind');
  const [location, setLocation] = useState('Sokoto Central (Region 1)');

  const tooltipStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(203, 213, 225, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
    color: '#0f172a',
    fontWeight: '600'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Filter Bar - Matching Image 2 */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>Date Range:</span>
            <select 
              className="form-control"
              style={{ width: '160px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>Data Type:</span>
            <select 
              className="form-control"
              style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="Temperature, Outage Risk, Wind">Temperature, Outage Risk, Wind</option>
              <option value="Precipitation & Grid Deficit">Precipitation & Grid Deficit</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)' }}>Location:</span>
            <select 
              className="form-control"
              style={{ width: '200px', padding: '0.45rem 0.75rem', fontSize: '0.825rem' }}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Sokoto Central (Region 1)">Sokoto Central (Region 1)</option>
              <option value="Wamako Sector">Wamako Sector</option>
              <option value="Dange Shuni Sector">Dange Shuni Sector</option>
            </select>
          </div>

        </div>

        <button className="btn-primary" style={{ fontSize: '0.825rem', padding: '0.55rem 1.25rem' }}>
          <Filter size={14} /> Apply Filters
        </button>
      </div>

      {/* Row 1: Temperature Trends Comparison Line Chart & Precipitation Levels */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.25rem' }}>
        
        {/* Temperature Trends Comparison */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Temperature Trends Comparison (°C)
            </h3>
            <span className="badge badge-cyan">30 Days Overlay</span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ANALYTICS_TEMP_COMPARISON} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                <YAxis domain={[20, 50]} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="historical" name="Historical (Last Year)" stroke="#0284c7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="current" name="Current Period" stroke="#d97706" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Precipitation Levels */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Precipitation Levels (Last 30 Days)
            </h3>
            <span className="badge badge-amber">Rainfall mm</span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_PRECIPITATION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="mm" name="Rainfall (mm)" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Wind Rose Diagram Radar & Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '1.25rem' }}>
        
        {/* Wind Rose Diagram */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Wind Rose Diagram (Direction & Speed)
            </h3>
            <Wind size={18} color="var(--liquid-teal)" />
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={WIND_ROSE_DATA}>
                <PolarGrid stroke="rgba(203, 213, 225, 0.5)" />
                <PolarAngleAxis dataKey="direction" stroke="var(--text-muted)" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 35]} stroke="var(--text-muted)" fontSize={10} />
                <Radar name="Wind Speed km/h" dataKey="speed" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Metrics Cards at Bottom - Matching Image 2 */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Regional Weather & Environmental Summary
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              
              <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.785rem', fontWeight: 600 }}>
                  <Thermometer size={14} color="var(--liquid-amber)" /> Avg Temp
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
                  38.4°C
                </div>
                <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 700 }}>↑ 1.2°C vs last year</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.785rem', fontWeight: 600 }}>
                  <CloudRain size={14} color="var(--liquid-cyan)" /> Total Rainfall
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
                  145 mm
                </div>
                <span style={{ fontSize: '0.725rem', color: '#e11d48', fontWeight: 700 }}>↓ 10 mm vs last year</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.785rem', fontWeight: 600 }}>
                  <Wind size={14} color="var(--liquid-teal)" /> Max Wind Speed
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
                  28 km/h
                </div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>NE Direction</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.75)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.785rem', fontWeight: 600 }}>
                  <ShieldCheck size={14} color="var(--liquid-emerald)" /> Air Quality
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.3rem' }}>
                  45 AQI
                </div>
                <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 700 }}>Good Air Quality</span>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
