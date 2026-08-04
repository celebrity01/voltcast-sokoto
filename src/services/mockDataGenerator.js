// Sokoto State Grid & Outage Mock Data Generator

export const SOKOTO_DISTRICTS = [
  { id: 'sokoto_north', name: 'Sokoto North', type: 'Commercial & Government', baselineRisk: 0.35, feeders: ['Central Market 11kV', 'Government House 33kV', 'Kano Road Feeder'], currentStatus: 'Normal', lat: 13.0622, lng: 5.2339, temp: 38, weather: 'Sunny', humidity: 45, uvIndex: '8 (High)', wind: '14 km/h NE' },
  { id: 'sokoto_south', name: 'Sokoto South', type: 'High Density Residential', baselineRisk: 0.45, feeders: ['Runjin Sambo 11kV', 'Ahmadu Bello Loop', 'Arkilla Feeder'], currentStatus: 'Warning', lat: 13.0489, lng: 5.2415, temp: 40, weather: 'Extreme Heat', humidity: 40, uvIndex: '9 (Very High)', wind: '18 km/h E' },
  { id: 'wamako', name: 'Wamako', type: 'Educational & Suburban', baselineRisk: 0.40, feeders: ['33kV Wamako Trunk Line', 'UDUS Main Campus Feeder', 'Kalambaina Industrial'], currentStatus: 'Normal', lat: 13.0381, lng: 5.1664, temp: 39, weather: 'Scattered Clouds', humidity: 52, uvIndex: '7 (High)', wind: '12 km/h NE' },
  { id: 'dange_shuni', name: 'Dange Shuni', type: 'Semi-Urban & Agricultural', baselineRisk: 0.55, feeders: ['Dange 33kV Line', 'Shuni Distribution Loop'], currentStatus: 'Outage Risk', lat: 12.8531, lng: 5.3444, temp: 41, weather: 'Thermal Heatwave', humidity: 38, uvIndex: '10 (Extreme)', wind: '22 km/h E' },
  { id: 'bodinga', name: 'Bodinga', type: 'Residential & Agricultural', baselineRisk: 0.50, feeders: ['Bodinga 11kV Circuit', 'Silame-Bodinga Tie Line'], currentStatus: 'Normal', lat: 12.8317, lng: 5.1436, temp: 37, weather: 'Clear', humidity: 48, uvIndex: '6 (Moderate)', wind: '15 km/h N' },
  { id: 'kware', name: 'Kware', type: 'Agricultural & Rural', baselineRisk: 0.58, feeders: ['Kware Feeder 11kV', 'Goronyo Line'], currentStatus: 'Normal', lat: 13.2189, lng: 5.2678, temp: 36, weather: 'Dust Haze', humidity: 35, uvIndex: '5 (Moderate)', wind: '20 km/h NE' },
  { id: 'gwadabawa', name: 'Gwadabawa', type: 'Border Sector', baselineRisk: 0.60, feeders: ['Gwadabawa 33kV Line', 'Tangaza Tie'], currentStatus: 'Outage Risk', lat: 13.3606, lng: 5.2442, temp: 42, weather: 'Extreme Heat', humidity: 30, uvIndex: '10 (Extreme)', wind: '25 km/h E' },
  { id: 'tambuwal', name: 'Tambuwal', type: 'Western Hub', baselineRisk: 0.48, feeders: ['Tambuwal Central Feeder', 'Jega-Tambuwal 33kV'], currentStatus: 'Normal', lat: 12.4042, lng: 4.6978, temp: 38, weather: 'Partly Cloudy', humidity: 55, uvIndex: '7 (High)', wind: '14 km/h SW' },
  { id: 'illela', name: 'Illela', type: 'Border Trade Zone', baselineRisk: 0.65, feeders: ['Illela International Circuit'], currentStatus: 'Outage Risk', lat: 13.7292, lng: 5.2975, temp: 43, weather: 'Severe Dust Storm', humidity: 25, uvIndex: '11 (Extreme)', wind: '28 km/h NE' },
  { id: 'silame', name: 'Silame', type: 'Riverine Sector', baselineRisk: 0.62, feeders: ['Silame Rural Circuit'], currentStatus: 'Normal', lat: 12.9819, lng: 4.8469, temp: 36, weather: 'Humid Breeze', humidity: 62, uvIndex: '6 (Moderate)', wind: '16 km/h S' },
];

export const HOURLY_TIMELINE = [
  { hour: 'Now', temp: 38, weather: 'Sunny', icon: 'sun', riskPct: 34, humidity: 45 },
  { hour: '1 PM', temp: 39, weather: 'Scattered Clouds', icon: 'cloud-sun', riskPct: 48, humidity: 42 },
  { hour: '2 PM', temp: 41, weather: 'Thermal Heatwave', icon: 'thermometer-sun', riskPct: 76, humidity: 38 },
  { hour: '3 PM', temp: 42, weather: 'Thermal Overload', icon: 'zap-off', riskPct: 88, humidity: 35 },
  { hour: '4 PM', temp: 40, weather: 'Dust Haze', icon: 'wind', riskPct: 62, humidity: 40 },
  { hour: '5 PM', temp: 38, weather: 'Clear Sky', icon: 'sun', riskPct: 45, humidity: 44 },
  { hour: '6 PM', temp: 36, weather: 'Clear Evening', icon: 'moon', riskPct: 32, humidity: 50 },
  { hour: '7 PM', temp: 34, weather: 'Cool Breeze', icon: 'wind', riskPct: 25, humidity: 55 },
  { hour: '8 PM', temp: 33, weather: 'Night Clear', icon: 'moon', riskPct: 18, humidity: 60 },
  { hour: '9 PM', temp: 31, weather: 'Night Clear', icon: 'moon', riskPct: 15, humidity: 62 },
  { hour: '10 PM', temp: 30, weather: 'Night Clear', icon: 'moon', riskPct: 12, humidity: 65 },
];

export const WIND_ROSE_DATA = [
  { direction: 'N', speed: 18, frequency: 16 },
  { direction: 'NE', speed: 29, frequency: 24 },
  { direction: 'E', speed: 22, frequency: 18 },
  { direction: 'SE', speed: 10, frequency: 8 },
  { direction: 'S', speed: 12, frequency: 10 },
  { direction: 'SW', speed: 15, frequency: 12 },
  { direction: 'W', speed: 8, frequency: 6 },
  { direction: 'NW', speed: 14, frequency: 11 },
];

export const ANALYTICS_TEMP_COMPARISON = [
  { date: 'Jan 1', historical: 32, current: 35 },
  { date: 'Jan 5', historical: 31, current: 37 },
  { date: 'Jan 9', historical: 34, current: 39 },
  { date: 'Jan 12', historical: 36, current: 41 },
  { date: 'Jan 15', historical: 38, current: 43 },
  { date: 'Jan 19', historical: 35, current: 40 },
  { date: 'Jan 23', historical: 33, current: 38 },
  { date: 'Jan 27', historical: 36, current: 41 },
  { date: 'Jan 31', historical: 37, current: 42 },
];

export const ANALYTICS_PRECIPITATION = [
  { date: 'Jan 1', mm: 0, gridDeficit: 1200 },
  { date: 'Jan 5', mm: 2, gridDeficit: 1400 },
  { date: 'Jan 9', mm: 8, gridDeficit: 1800 },
  { date: 'Jan 12', mm: 14, gridDeficit: 2200 },
  { date: 'Jan 15', mm: 19, gridDeficit: 2400 },
  { date: 'Jan 19', mm: 12, gridDeficit: 1900 },
  { date: 'Jan 23', mm: 6, gridDeficit: 1600 },
  { date: 'Jan 27', mm: 16, gridDeficit: 2100 },
  { date: 'Jan 31', mm: 4, gridDeficit: 1300 },
];

export const FEEDERS = [
  '33kV Wamako Trunk Line',
  '11kV Arkilla Feeder',
  'Central Market 11kV',
  '33kV Birnin Kebbi-Sokoto Corridor',
  'UDUS Main Campus Feeder',
  'Runjin Sambo 11kV',
  'Kalambaina Industrial Feeder',
  'Government House 33kV',
  'Dange 33kV Line',
  'Gwadabawa 33kV Line'
];

export const HOURLY_OUTAGE_TREND = [
  { hour: '00:00', frequency: 12, avgDuration: 1.8, riskMultiplier: 0.8 },
  { hour: '02:00', frequency: 8, avgDuration: 1.5, riskMultiplier: 0.6 },
  { hour: '04:00', frequency: 6, avgDuration: 1.2, riskMultiplier: 0.5 },
  { hour: '06:00', frequency: 14, avgDuration: 2.1, riskMultiplier: 0.9 },
  { hour: '08:00', frequency: 22, avgDuration: 2.4, riskMultiplier: 1.2 },
  { hour: '10:00', frequency: 31, avgDuration: 2.8, riskMultiplier: 1.5 },
  { hour: '12:00', frequency: 45, avgDuration: 3.5, riskMultiplier: 2.1 },
  { hour: '14:00', frequency: 62, avgDuration: 4.2, riskMultiplier: 2.8 },
  { hour: '16:00', frequency: 58, avgDuration: 4.0, riskMultiplier: 2.6 },
  { hour: '18:00', frequency: 48, avgDuration: 3.2, riskMultiplier: 2.0 },
  { hour: '20:00', frequency: 38, avgDuration: 2.9, riskMultiplier: 1.7 },
  { hour: '22:00', frequency: 20, avgDuration: 2.0, riskMultiplier: 1.0 },
];

export const SEASONAL_TRENDS = [
  { month: 'Jan', season: 'Harmattan', outages: 42, avgTemp: 32, dustIndex: 78, gridDeficitMW: 1200 },
  { month: 'Feb', season: 'Harmattan / Dry', outages: 48, avgTemp: 35, dustIndex: 65, gridDeficitMW: 1350 },
  { month: 'Mar', season: 'Peak Dry Heat', outages: 88, avgTemp: 41, dustIndex: 40, gridDeficitMW: 2100 },
  { month: 'Apr', season: 'Peak Dry Heat', outages: 95, avgTemp: 43, dustIndex: 30, gridDeficitMW: 2400 },
  { month: 'May', season: 'Pre-Monsoon Heat', outages: 76, avgTemp: 40, dustIndex: 25, gridDeficitMW: 1950 },
  { month: 'Jun', season: 'Early Rainy', outages: 64, avgTemp: 36, dustIndex: 10, gridDeficitMW: 1600 },
  { month: 'Jul', season: 'Heavy Rainy', outages: 72, avgTemp: 32, dustIndex: 5, gridDeficitMW: 1400 },
  { month: 'Aug', season: 'Peak Rainy', outages: 82, avgTemp: 30, dustIndex: 5, gridDeficitMW: 1550 },
  { month: 'Sep', season: 'Late Rainy', outages: 54, avgTemp: 33, dustIndex: 15, gridDeficitMW: 1300 },
  { month: 'Oct', season: 'Post Rainy', outages: 38, avgTemp: 36, dustIndex: 30, gridDeficitMW: 1100 },
  { month: 'Nov', season: 'Harmattan Onset', outages: 35, avgTemp: 34, dustIndex: 50, gridDeficitMW: 1050 },
  { month: 'Dec', season: 'Harmattan', outages: 39, avgTemp: 31, dustIndex: 82, gridDeficitMW: 1150 },
];

export const FEEDER_RELIABILITY_STATS = [
  { name: 'Central Market 11kV', mtbf: 38, mttr: 1.5, availability: 96.2, totalOutages30d: 8 },
  { name: 'Govt House 33kV', mtbf: 52, mttr: 1.1, availability: 97.9, totalOutages30d: 5 },
  { name: '33kV Wamako Trunk', mtbf: 24, mttr: 2.8, availability: 91.5, totalOutages30d: 16 },
  { name: 'Arkilla Feeder', mtbf: 20, mttr: 3.2, availability: 89.1, totalOutages30d: 19 },
  { name: 'Runjin Sambo 11kV', mtbf: 18, mttr: 3.5, availability: 88.0, totalOutages30d: 22 },
  { name: 'UDUS Campus Feeder', mtbf: 30, mttr: 2.1, availability: 93.8, totalOutages30d: 11 },
  { name: 'Dange 33kV Line', mtbf: 15, mttr: 4.1, availability: 84.5, totalOutages30d: 26 },
  { name: 'Gwadabawa 33kV Line', mtbf: 14, mttr: 4.5, availability: 83.2, totalOutages30d: 28 },
];

export const OUTAGE_CAUSES = [
  { name: 'National Grid Load Shedding', percentage: 42, color: '#ef4444' },
  { name: 'Thermal Overload (High Heat)', percentage: 26, color: '#f59e0b' },
  { name: 'Storm / Rain Damage', percentage: 16, color: '#0284c7' },
  { name: 'Equipment Aging & Faults', percentage: 11, color: '#7c3aed' },
  { name: 'Vandalism / Maintenance', percentage: 5, color: '#059669' },
];

export const MODEL_EVALUATION_METRICS = {
  accuracy: 0.914,
  precision: 0.887,
  recall: 0.932,
  f1Score: 0.909,
  aucRoc: 0.946,
  logLoss: 0.215,
  datasetSize: 5240,
  trainRatio: '80 / 20 Split',
  lastRetrained: '2026-08-01',
  confusionMatrix: {
    tp: 840,
    fp: 107,
    fn: 61,
    tn: 792
  }
};

export const ROC_CURVE_DATA = [
  { fpr: 0.00, tpr: 0.00 },
  { fpr: 0.02, tpr: 0.25 },
  { fpr: 0.05, tpr: 0.58 },
  { fpr: 0.09, tpr: 0.78 },
  { fpr: 0.12, tpr: 0.88 },
  { fpr: 0.18, tpr: 0.93 },
  { fpr: 0.25, tpr: 0.96 },
  { fpr: 0.40, tpr: 0.98 },
  { fpr: 0.60, tpr: 0.99 },
  { fpr: 1.00, tpr: 1.00 },
];

export const FEATURE_IMPORTANCE = [
  { feature: 'Grid Supply Deficit (MW)', importance: 0.32, category: 'Grid State' },
  { feature: 'Ambient Air Temperature (°C)', importance: 0.24, category: 'Environment' },
  { feature: 'Feeder Transformer Age & Load', importance: 0.18, category: 'Infrastructure' },
  { feature: 'Thunderstorm / Dust Severity', importance: 0.14, category: 'Weather' },
  { feature: 'Hour of Day (Peak Demand Window)', importance: 0.12, category: 'Temporal' },
];

export const BACKTEST_30DAYS = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const baseProb = Math.min(0.95, Math.max(0.15, Math.sin(day / 3) * 0.35 + 0.5 + (Math.random() * 0.1 - 0.05)));
  const actualOutage = baseProb > 0.52 ? 1 : 0;
  return {
    date: `Jul ${day < 10 ? '0' + day : day}`,
    predictedProb: Math.round(baseProb * 100),
    actualOutage: actualOutage * 100,
    correct: (baseProb > 0.50 && actualOutage === 1) || (baseProb <= 0.50 && actualOutage === 0)
  };
});

export const RECENT_OUTAGE_LOGS = [
  { id: 'OUT-9821', district: 'Sokoto South', feeder: 'Runjin Sambo 11kV', cause: 'National Grid Load Shedding', duration: '4h 15m', time: '2026-08-03 14:30', status: 'Restored', riskSeverity: 'High' },
  { id: 'OUT-9820', district: 'Wamako', feeder: '33kV Wamako Trunk Line', cause: 'Thermal Overload Trip', duration: '2h 40m', time: '2026-08-03 13:10', status: 'Restored', riskSeverity: 'High' },
  { id: 'OUT-9819', district: 'Dange Shuni', feeder: 'Dange 33kV Line', cause: 'Dust Storm Insulation Fault', duration: '5h 50m', time: '2026-08-02 18:00', status: 'Restored', riskSeverity: 'Severe' },
  { id: 'OUT-9818', district: 'Sokoto North', feeder: 'Central Market 11kV', cause: 'Transformer Tap Changer Failure', duration: '1h 20m', time: '2026-08-02 10:45', status: 'Restored', riskSeverity: 'Moderate' },
  { id: 'OUT-9817', district: 'Gwadabawa', feeder: 'Gwadabawa 33kV Line', cause: 'Grid Frequency Drop (48.8Hz)', duration: '3h 10m', time: '2026-08-01 21:15', status: 'Restored', riskSeverity: 'High' },
  { id: 'OUT-9816', district: 'Illela', feeder: 'Illela International Circuit', cause: 'Scheduled Load Control', duration: '6h 00m', time: '2026-08-01 12:00', status: 'Restored', riskSeverity: 'Severe' },
  { id: 'OUT-9815', district: 'Bodinga', feeder: 'Bodinga 11kV Circuit', cause: 'Feeder Overcurrent Protection', duration: '2h 05m', time: '2026-07-31 16:20', status: 'Restored', riskSeverity: 'Moderate' },
];
