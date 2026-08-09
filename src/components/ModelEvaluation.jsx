import React, { useState, useEffect } from 'react';
import { getDynamicModelMetrics, subscribeDataChanges } from '../services/dataSyncEngine';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TestTube2, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';

export default function ModelEvaluation() {
  const [decisionThreshold, setDecisionThreshold] = useState(0.50);
  const [metrics, setMetrics] = useState(() => getDynamicModelMetrics(0.50));

  useEffect(() => {
    const update = () => {
      setMetrics(getDynamicModelMetrics(decisionThreshold));
    };
    update();
    const unsubscribe = subscribeDataChanges(update);
    return () => unsubscribe();
  }, [decisionThreshold]);

  const FEATURE_IMPORTANCES = [
    { feature: 'Ambient Temperature (°C)', importance: 32 },
    { feature: 'Transformer Load Health', importance: 24 },
    { feature: 'National Grid Deficit', importance: 20 },
    { feature: 'Diurnal Hour Window', importance: 14 },
    { feature: 'Seasonal Harmattan/Heat', importance: 10 },
  ];

  const ROC_CURVE = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.05, tpr: 0.35 },
    { fpr: 0.10, tpr: 0.65 },
    { fpr: 0.15, tpr: 0.82 },
    { fpr: 0.20, tpr: 0.91 },
    { fpr: 0.30, tpr: 0.95 },
    { fpr: 0.50, tpr: 0.98 },
    { fpr: 1.0, tpr: 1.0 },
  ];

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
      
      {/* Top Banner Ticker */}
      <div className="glass-card" style={{ padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <TestTube2 size={22} color="var(--liquid-cyan)" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Outage Classifier Model Evaluation & Threshold Calibration
            </h2>
            <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
              Real-time classification metrics dynamically recalibrated from {metrics.totalRecordsProcessed} uploaded dataset records
            </span>
          </div>
        </div>

        <span className="badge badge-emerald">Model Status: Calibrated</span>
      </div>

      {/* Dynamic Metrics Cards Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }} className="metrics-5col-grid">
        
        <div className="glass-card" style={{ padding: '1.1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACCURACY</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--liquid-cyan)', marginTop: '0.2rem' }}>
            {metrics.accuracy}%
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PRECISION</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
            {metrics.precision}%
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RECALL</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '0.2rem' }}>
            {metrics.recall}%
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>F1 SCORE</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.2rem' }}>
            {metrics.f1Score}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>AUC-ROC</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
            0.932
          </div>
        </div>

      </div>

      {/* Interactive Decision Threshold Control Slider */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(240, 247, 255, 0.85))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="var(--liquid-cyan)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Interactive Classification Threshold Tuner
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--liquid-cyan)' }}>
            Cutoff Threshold: {(decisionThreshold * 100).toFixed(0)}%
          </span>
        </div>

        <input 
          type="range"
          min="0.10"
          max="0.90"
          step="0.05"
          value={decisionThreshold}
          onChange={(e) => setDecisionThreshold(parseFloat(e.target.value))}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600 }}>
          <span>0.10 (High Sensitivity / Max Recall)</span>
          <span>0.50 (Balanced Optimal)</span>
          <span>0.90 (High Precision / Low False Alarms)</span>
        </div>
      </div>

      {/* Grid Row 2: Confusion Matrix & ROC Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '1.25rem' }}>
        
        {/* Confusion Matrix */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Dynamic 2x2 Confusion Matrix
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="confusion-matrix-grid">
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857' }}>TRUE POSITIVE (TP)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>
                {metrics.confusionMatrix.tp}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Correctly Predicted Outage</span>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309' }}>FALSE POSITIVE (FP)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#b45309', marginTop: '0.2rem' }}>
                {metrics.confusionMatrix.fp}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>False Alarm</span>
            </div>

            <div style={{ background: 'rgba(218, 52, 55, 0.12)', border: '1px solid rgba(218, 52, 55, 0.35)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#be123c' }}>FALSE NEGATIVE (FN)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#be123c', marginTop: '0.2rem' }}>
                {metrics.confusionMatrix.fn}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Missed Outage Event</span>
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.35)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0058be' }}>TRUE NEGATIVE (TN)</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#0058be', marginTop: '0.2rem' }}>
                {metrics.confusionMatrix.tn}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Correct Normal Grid</span>
            </div>
          </div>
        </div>

        {/* Feature Importances */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Feature Weight Importances (%)
          </h3>

          <div style={{ height: '230px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={FEATURE_IMPORTANCES} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} domain={[0, 40]} />
                <YAxis dataKey="feature" type="category" stroke="var(--text-muted)" fontSize={11} width={130} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="importance" name="Weight %" fill="#0058be" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
