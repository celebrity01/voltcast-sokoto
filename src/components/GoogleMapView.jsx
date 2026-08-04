import React, { useEffect, useRef, useState } from 'react';
import { SOKOTO_DISTRICTS } from '../services/mockDataGenerator';
import { Search, MapPin, CloudRain, Zap, Radio, Layers, Activity, Compass, Flame } from 'lucide-react';

const DARK_CYAN_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#081321" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#081321" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f172a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#0284c7" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#032d4d" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] }
];

export default function GoogleMapView({ selectedDistrictId, onSelectDistrict }) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState('feeders'); // 'feeders', 'heatmap', 'topography'

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setMapLoaded(false);
      return;
    }

    let isMounted = true;
    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);

    const initMap = () => {
      if (!isMounted || !mapRef.current || !window.google || !window.google.maps) return;
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 13.0622, lng: 5.2339 }, // Sokoto, Nigeria
          zoom: 11,
          styles: DARK_CYAN_MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
        });

        setMapLoaded(true);

        SOKOTO_DISTRICTS.forEach((district) => {
          const marker = new window.google.maps.Marker({
            position: { lat: district.lat, lng: district.lng },
            map: map,
            title: `${district.name} - ${district.temp}°C`,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="color: #0f172a; padding: 6px; font-family: sans-serif;">
                <strong style="font-size: 14px; color: #0058be;">${district.name}</strong><br/>
                <span style="font-size: 12px;">Temperature: <b>${district.temp}°C</b> (${district.weather})</span><br/>
                <span style="font-size: 12px;">Outage Risk: <b style="color: ${district.baselineRisk > 0.5 ? '#da3437' : '#059669'}">${Math.round(district.baselineRisk * 100)}%</b></span>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
            onSelectDistrict(district.id);
          });
        });
      } catch (err) {
        console.warn('Google Maps initialization fallback active:', err);
        setMapLoaded(false);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
          if (isMounted) setMapLoaded(false);
        };
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', initMap);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [onSelectDistrict]);

  const filteredDistricts = SOKOTO_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '480px',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.95)',
      boxShadow: '0 20px 50px -15px rgba(0, 88, 190, 0.18), inset 0 2px 3px rgba(255, 255, 255, 0.8)',
      background: 'linear-gradient(135deg, #0b1e36 0%, #081426 100%)'
    }}>
      
      {/* Top Glass Search & Map Controls Overlay */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Search Input Bar */}
        <div style={{ flex: 1, minWidth: '260px', maxWidth: '420px', position: 'relative' }}>
          <Search size={16} color="#0058be" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search Sokoto LGA (Sokoto North, Wamako...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 1)',
              borderRadius: '9999px',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              color: '#0f172a',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: '600',
              outline: 'none',
              boxShadow: '0 8px 25px rgba(0, 88, 190, 0.15)'
            }}
          />
        </div>

        {/* Map Layer Mode Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          padding: '0.3rem',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button 
            onClick={() => setActiveLayer('feeders')}
            style={{
              background: activeLayer === 'feeders' ? 'linear-gradient(135deg, #0058be, #06b6d4)' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Zap size={13} /> Power Feeders
          </button>
          <button 
            onClick={() => setActiveLayer('heatmap')}
            style={{
              background: activeLayer === 'heatmap' ? 'linear-gradient(135deg, #da3437, #be123c)' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Flame size={13} /> Thermal Risk
          </button>
        </div>
      </div>

      {/* Google Map Container Element */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '480px', display: mapLoaded ? 'block' : 'none' }}></div>

      {/* High-Tech Interactive GIS Canvas Map (Fallback & Rich Visualization) */}
      {!mapLoaded && (
        <div style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '4.5rem 1.5rem 1.5rem 1.5rem',
          background: 'radial-gradient(ellipse at 50% 40%, #0d2440 0%, #061120 100%)'
        }}>
          
          {/* Cyber Power Grid Topology SVG Background Overlay */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.25, pointerEvents: 'none' }}>
            <defs>
              <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0058be" strokeWidth="1"/>
                <circle cx="40" cy="40" r="1.5" fill="#06b6d4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cyber-grid)" />
            {/* Glowing Inter-District Feeder Grid Lines */}
            <path d="M 100 120 Q 250 80 400 130 T 700 120" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4" />
            <path d="M 120 280 Q 300 240 500 290 T 800 280" fill="none" stroke="#0058be" strokeWidth="2" strokeDasharray="8 4" />
          </svg>

          {/* Interactive Sokoto LGA Cards Layout */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'stretch',
            margin: '1rem 0'
          }}>
            {filteredDistricts.map(district => {
              const isSelected = district.id === selectedDistrictId;
              const riskPct = Math.round(district.baselineRisk * 100);
              const isHighRisk = riskPct > 50;

              return (
                <div 
                  key={district.id}
                  onClick={() => onSelectDistrict(district.id)}
                  style={{
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(0, 88, 190, 0.45), rgba(6, 182, 212, 0.35))'
                      : 'rgba(15, 23, 42, 0.72)',
                    backdropFilter: 'blur(16px)',
                    border: `1.5px solid ${isSelected ? '#06b6d4' : (isHighRisk ? 'rgba(218, 52, 55, 0.4)' : 'rgba(255, 255, 255, 0.18)')}`,
                    borderRadius: '18px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected 
                      ? '0 10px 30px rgba(6, 182, 212, 0.35), inset 0 1px 2px rgba(255,255,255,0.4)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.25)',
                    transform: isSelected ? 'translateY(-3px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.6rem'
                  }}
                >
                  {/* Card Header: District Name & Sensor Dot */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} color={isSelected ? '#38bdf8' : 'var(--text-dim)'} />
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.925rem', fontWeight: 800, color: '#ffffff' }}>
                        {district.name}
                      </span>
                    </div>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isHighRisk ? '#ef4444' : '#10b981',
                      boxShadow: `0 0 8px ${isHighRisk ? '#ef4444' : '#10b981'}`
                    }} />
                  </div>

                  {/* Temperature & Weather Info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                        {district.temp}°
                      </span>
                      <span style={{ fontSize: '0.725rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        {district.weather}
                      </span>
                    </div>
                    <CloudRain size={18} color="#38bdf8" />
                  </div>

                  {/* Outage Risk Badge & Feeder */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.675rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                      {district.feeders[0] || '11kV Feeder'}
                    </span>
                    <span style={{
                      background: isHighRisk ? 'rgba(218, 52, 55, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                      color: isHighRisk ? '#fca5a5' : '#6ee7b7',
                      border: `1px solid ${isHighRisk ? 'rgba(218, 52, 55, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.725rem',
                      fontWeight: 800
                    }}>
                      {riskPct}% Risk
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom GIS Coordinates Telemetry Footer */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.1rem',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.785rem', color: '#94a3b8', fontWeight: 600 }}>
              <Radio size={15} color="#06b6d4" className="animate-pulse" />
              <span>Sokoto Regional GIS Grid • Centered 13.0622° N, 5.2339° E</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
              <Activity size={14} /> 10 LGAs Monitored Live
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
