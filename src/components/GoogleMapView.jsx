import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { SOKOTO_DISTRICTS } from '../services/mockDataGenerator';
import { Search, MapPin, Layers, RefreshCw, Sun, CloudRain, Zap, Thermometer } from 'lucide-react';

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
  const googleMapInstance = useRef(null);

  useEffect(() => {
    // Attempt loading Google Maps API using DEMO or env key
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then((google) => {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 13.0622, lng: 5.2339 }, // Sokoto, Nigeria
        zoom: 11,
        styles: DARK_CYAN_MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
      });

      googleMapInstance.current = map;
      setMapLoaded(true);

      // Add Markers for Sokoto Districts
      SOKOTO_DISTRICTS.forEach((district) => {
        const marker = new google.maps.Marker({
          position: { lat: district.lat, lng: district.lng },
          map: map,
          title: `${district.name} - ${district.temp}°C`,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="color: #0f172a; padding: 4px; font-family: sans-serif;">
              <strong style="font-size: 14px;">${district.name}</strong><br/>
              <span>Temp: <b>${district.temp}°C</b> (${district.weather})</span><br/>
              <span>Risk: <b>${Math.round(district.baselineRisk * 100)}%</b></span>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          onSelectDistrict(district.id);
        });
      });
    }).catch(() => {
      // Fallback to interactive canvas map if API key is not active
      setMapLoaded(false);
    });
  }, [onSelectDistrict]);

  const filteredDistricts = SOKOTO_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '360px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'linear-gradient(135deg, #071527, #0c1e36)' }}>
      
      {/* Top Search Bar */}
      <div style={{ position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '90%', maxWidth: '420px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search location (Sokoto North, Wamako...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              borderRadius: '9999px',
              padding: '0.6rem 1rem 0.6rem 2.5rem',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </div>

      {/* Google Map Container Element */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '360px', display: mapLoaded ? 'block' : 'none' }}></div>

      {/* High-Tech Interactive Canvas Map (Fallback / Custom Render) */}
      {!mapLoaded && (
        <div style={{ width: '100%', height: '100%', minHeight: '360px', display: 'flex', flexDirection: 'column', position: 'relative', padding: '1.5rem', background: 'radial-gradient(ellipse at center, #0f2744 0%, #061120 100%)' }}>
          
          {/* Cyber Grid Lines Overlay */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15 }}>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0284c7" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* District Pins Layout */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.8rem', marginTop: '3.5rem', alignItems: 'center' }}>
            {filteredDistricts.map(district => {
              const isSelected = district.id === selectedDistrictId;
              const riskPct = Math.round(district.baselineRisk * 100);
              return (
                <div 
                  key={district.id}
                  onClick={() => onSelectDistrict(district.id)}
                  style={{
                    background: isSelected ? 'rgba(14, 165, 233, 0.25)' : 'rgba(15, 23, 42, 0.65)',
                    border: `1px solid ${isSelected ? 'var(--liquid-cyan)' : 'rgba(255, 255, 255, 0.15)'}`,
                    borderRadius: '14px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(14, 165, 233, 0.4)' : '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#fff' }}>{district.name}</span>
                    <CloudRain size={14} color="var(--liquid-cyan)" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{district.temp}°C</span>
                    <span style={{ color: riskPct > 55 ? '#ef4444' : '#10b981', fontWeight: 700 }}>{riskPct}% Risk</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <MapPin size={14} color="var(--liquid-cyan)" /> Sokoto Regional GIS Grid | Centered 13.0622° N, 5.2339° E
          </div>
        </div>
      )}

    </div>
  );
}
