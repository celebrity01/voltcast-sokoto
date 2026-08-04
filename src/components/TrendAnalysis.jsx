import React from 'react';
import { 
  HOURLY_OUTAGE_TREND, 
  SEASONAL_TRENDS, 
  FEEDER_RELIABILITY_STATS, 
  OUTAGE_CAUSES 
} from '../services/mockDataGenerator';
import { 
  BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, XAxis, YAxis 
} from 'recharts';
import { BarChart3, Clock, Calendar, ShieldAlert, Wrench } from 'lucide-react';

export default function TrendAnalysis() {
  const tooltipStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(203, 213, 225, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
    color: '#0f172a',
    fontWeight: '600'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <BarChart3 size={22} color="var(--liquid-cyan)" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Historical Outage Pattern & Trend Analytics
          </h2>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Comprehensive multi-year historical trend modeling for Sokoto State Transmission & Distribution Grids
        </p>
      </div>

      {/* Row 1: Hourly Distribution & Seasonal Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Hourly Distribution Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color="var(--liquid-cyan)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              24-Hour Diurnal Outage Distribution
            </h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_OUTAGE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#0f172a', fontWeight: 'bold' }} />
                <Legend />
                <Bar dataKey="frequency" name="Outage Frequency (30d)" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seasonal Monthly Outages */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Calendar size={18} color="var(--liquid-amber)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Monthly Outages & Grid Deficit MW
            </h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEASONAL_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#0f172a', fontWeight: 'bold' }} />
                <Legend />
                <Bar dataKey="outages" name="Total Outages" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Feeder Reliability Benchmarking & Cause Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.5rem' }}>
        
        {/* Feeder MTBF & Availability */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Wrench size={18} color="var(--liquid-emerald)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Feeder MTBF (Mean Time Between Failures) in Hours
            </h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={FEEDER_RELIABILITY_STATS} margin={{ top: 10, right: 20, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="mtbf" name="MTBF (Hours)" fill="#059669" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cause Breakdown Donut Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <ShieldAlert size={18} color="var(--liquid-crimson)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Outage Root Cause Breakdown
            </h3>
          </div>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={OUTAGE_CAUSES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="percentage"
                >
                  {OUTAGE_CAUSES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
            {OUTAGE_CAUSES.map(cause => (
              <div key={cause.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cause.color }}></span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{cause.name}</span>
                </div>
                <strong style={{ color: 'var(--text-main)' }}>{cause.percentage}%</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
