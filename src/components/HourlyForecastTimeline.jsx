import React, { useRef } from 'react';
import { HOURLY_TIMELINE } from '../services/mockDataGenerator';
import { ChevronLeft, ChevronRight, Sun, CloudSun, CloudRain, ZapOff, Wind, Moon } from 'lucide-react';

export default function HourlyForecastTimeline({ onSelectHour, selectedHour }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'sun': return <Sun size={24} color="#f59e0b" />;
      case 'cloud-sun': return <CloudSun size={24} color="#0284c7" />;
      case 'cloud-rain': return <CloudRain size={24} color="#0284c7" />;
      case 'zap-off': return <ZapOff size={24} color="#ef4444" />;
      case 'wind': return <Wind size={24} color="#0d9488" />;
      case 'moon': return <Moon size={24} color="#8b5cf6" />;
      default: return <Sun size={24} color="#f59e0b" />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.8rem', position: 'relative' }}>
      
      {/* Scroll Left Button */}
      <button 
        onClick={() => scroll('left')}
        className="btn-secondary"
        style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(203, 213, 225, 0.8)' }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Scrollable Timeline Container */}
      <div 
        ref={scrollRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          width: '100%',
          padding: '0.25rem 0'
        }}
      >
        {HOURLY_TIMELINE.map((item, index) => {
          const hourVal = index * 2;
          const isSelected = selectedHour === hourVal;

          return (
            <div
              key={item.hour}
              onClick={() => onSelectHour(hourVal)}
              style={{
                flex: '0 0 auto',
                minWidth: '100px',
                background: isSelected ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.65)',
                border: `1px solid ${isSelected ? 'var(--liquid-cyan)' : 'rgba(226, 232, 240, 0.8)'}`,
                borderRadius: '16px',
                padding: '0.85rem 0.6rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isSelected ? '0 6px 20px rgba(14, 165, 233, 0.2)' : '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>
                {item.hour}
              </div>

              <div style={{ margin: '0.4rem 0', display: 'flex', justifyContent: 'center' }}>
                {getWeatherIcon(item.icon)}
              </div>

              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {item.temp}°
              </div>

              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: item.riskPct > 55 ? '#ef4444' : 'var(--liquid-cyan)', marginTop: '0.2rem' }}>
                {item.riskPct}% Risk
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button 
        onClick={() => scroll('right')}
        className="btn-secondary"
        style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(203, 213, 225, 0.8)' }}
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
}
