import React, { useState } from 'react';
import { 
  MODEL_EVALUATION_METRICS, 
  ROC_CURVE_DATA, 
  FEATURE_IMPORTANCE, 
  BACKTEST_30DAYS 
} from '../services/mockDataGenerator';
import { recalculateThresholdMetrics } from '../services/predictionEngine';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar 
} from 'recharts';
import { TestTube2, CheckCircle, Target, Award, Layers, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function ModelEvaluation() {
  const [threshold, setThreshold] = useState(0.50);
  const liveMetrics = recalculateThresholdMetrics(threshold);

  const m = MODEL_EVALUATION_METRICS;

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
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <TestTube2 size={22} color="var(--liquid-cyan)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Machine Learning Model Performance & Evaluation
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Validation metrics, backtesting performance, ROC curve, and feature importances (Ensemble XGBoost + Random Forest)
          </p>
        </div>

        {/* Dynamic Threshold Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.85)', padding: '0.65rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(14, 165, 233, 0.3)', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.08)' }}>
          <SlidersHorizontal size={18} color="var(--liquid-cyan)" />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Classification Threshold: <strong style={{ color: 'var(--liquid-cyan)', fontSize: '0.9rem' }}>{threshold.toFixed(2)}</strong>
            </div>
            <input 
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              style={{ width: '140px', height: '6px' }}
            />
          </div>
        </div>
      </div>

      {/* Top Key Metrics Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Accuracy Score
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--liquid-emerald)' }}>
            {(liveMetrics.accuracy * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', fontWeight: 500 }}>Overall Accuracy</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Precision
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--liquid-cyan)' }}>
            {(liveMetrics.precision * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', fontWeight: 500 }}>Positive Predictive Value</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Recall (Sensitivity)
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--liquid-amber)' }}>
            {(liveMetrics.recall * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', fontWeight: 500 }}>True Positive Rate</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            F1-Score
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--liquid-violet)' }}>
            {(liveMetrics.f1Score * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', fontWeight: 500 }}>Harmonic Mean</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', fontWeight: 700 }}>
            AUC - ROC
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800, color: '#db2777' }}>
            {m.aucRoc.toFixed(3)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', fontWeight: 500 }}>Area Under ROC</div>
        </div>

      </div>

      {/* Row 2: Confusion Matrix & ROC Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '1.5rem' }}>
        
        {/* Confusion Matrix */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} color="var(--liquid-cyan)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Confusion Matrix (Cutoff @ {threshold.toFixed(2)})
              </h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '0.6rem', textAlign: 'center' }}>
            {/* Headers */}
            <div></div>
            <div style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>
              PREDICTED OUTAGE
            </div>
            <div style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>
              PREDICTED NO OUTAGE
            </div>

            {/* Row 1: Actual Outage */}
            <div style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
              ACTUAL OUTAGE
            </div>
            
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '1.25rem', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 800 }}>TRUE POSITIVE (TP)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{liveMetrics.tp}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Outage correctly predicted</div>
            </div>

            <div style={{ background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.35)', padding: '1.25rem', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: '#be123c', fontWeight: 800 }}>FALSE NEGATIVE (FN)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{liveMetrics.fn}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Outage missed</div>
            </div>

            {/* Row 2: Actual No Outage */}
            <div style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
              ACTUAL NO OUTAGE
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '1.25rem', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 800 }}>FALSE POSITIVE (FP)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{liveMetrics.fp}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>False alarm trigger</div>
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.35)', padding: '1.25rem', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 800 }}>TRUE NEGATIVE (TN)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{liveMetrics.tn}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Normal state correctly predicted</div>
            </div>

          </div>
        </div>

        {/* ROC Curve Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="var(--liquid-violet)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Receiver Operating Characteristic (ROC Curve)
              </h3>
            </div>
            <span className="badge badge-violet">AUC = {m.aucRoc}</span>
          </div>

          <div style={{ height: '270px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ROC_CURVE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis dataKey="fpr" type="number" domain={[0, 1]} stroke="var(--text-muted)" fontSize={12} label={{ value: 'False Positive Rate', position: 'bottom', offset: 0, fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis dataKey="tpr" type="number" domain={[0, 1]} stroke="var(--text-muted)" fontSize={12} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="tpr" name="Model ROC" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Feature Importance & 30-Day Backtesting */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '1.5rem' }}>
        
        {/* Feature Importance Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={18} color="var(--liquid-cyan)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Model Feature Importance Weights
            </h3>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={FEATURE_IMPORTANCE} margin={{ top: 10, right: 20, left: 100, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis type="number" domain={[0, 0.4]} stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="feature" type="category" stroke="var(--text-muted)" fontSize={10} width={120} />
                <Tooltip 
                  contentStyle={tooltipStyle} 
                  formatter={(val) => [`${(val * 100).toFixed(1)}% Weight`, 'Importance']}
                />
                <Bar dataKey="importance" name="Weight" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 30-Day Backtesting Timeline */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} color="var(--liquid-emerald)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                30-Day Historical Backtest Performance
              </h3>
            </div>
            <span className="badge badge-emerald">28 / 30 Days Correct</span>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BACKTEST_30DAYS} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="predictedProb" name="Predicted Risk %" stroke="#0284c7" strokeWidth={2.5} dot={false} />
                <Line type="stepAfter" dataKey="actualOutage" name="Actual Outage Event (100=Yes)" stroke="#e11d48" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
