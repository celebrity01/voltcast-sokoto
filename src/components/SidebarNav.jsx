import React from 'react';
import { 
  Zap, LayoutDashboard, MapPin, BarChart3, TestTube2, History, Settings 
} from 'lucide-react';

export default function SidebarNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predictor', label: 'Predictor Engine', icon: Zap },
    { id: 'heatmap', label: 'District Heatmap', icon: MapPin },
    { id: 'trends', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'evaluation', label: 'Model Evaluation', icon: TestTube2 },
    { id: 'logs', label: 'Alerts & Logs', icon: History },
  ];

  return (
    <aside className="desktop-sidebar" style={{
      width: '240px',
      flexShrink: 0,
      background: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(24px) saturate(180%)',
      borderRight: '1px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '4px 0 25px rgba(0, 88, 190, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1rem',
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }}>
      
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.4rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0058be, #06b6d4)',
            padding: '0.55rem',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(0, 88, 190, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.7)'
          }}>
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #191c1e, #0058be)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VoltCast
            </h1>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Command Center</span>
          </div>
        </div>

        {/* Navigation Item List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(0, 88, 190, 0.15), rgba(124, 58, 237, 0.1))' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(0, 88, 190, 0.45)' : 'transparent'}`,
                  color: isActive ? '#0058be' : 'var(--text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.875rem',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 4px 15px rgba(0, 88, 190, 0.12)' : 'none'
                }}
              >
                <Icon size={18} color={isActive ? '#0058be' : 'var(--text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Settings */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(226, 232, 240, 0.7)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.8rem', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}>
          <Settings size={16} /> Settings
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.8rem', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--liquid-cyan)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
            JS
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>J. Smith</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Grid Controller</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
