// Electricity Outage Prediction Engine logic for Sokoto Region
// Interlinked with real-time uploaded outage datasets via dataSyncEngine.js

import { getDynamicDistricts, getDynamicModelMetrics } from './dataSyncEngine';
import { HOURLY_OUTAGE_TREND } from './mockDataGenerator';

export function calculateOutageProbability(params) {
  const {
    districtId = 'sokoto_north',
    feederName = '33kV Wamako Trunk Line',
    hour = 14,
    season = 'Peak Dry Heat',
    weather = 'Extreme Heat >40°C',
    gridStatus = 'Scheduled Load Shedding',
    transformerHealth = 'Fair',
    recentMaintenance = false
  } = params;

  // 1. Fetch dynamic real-time LGA profile (recalculated from uploaded datasets)
  const districts = getDynamicDistricts();
  const districtObj = districts.find(d => d.id === districtId) || districts[0];
  let baseRisk = districtObj.baselineRisk;

  // 2. Hour multiplier
  const hourObj = HOURLY_OUTAGE_TREND.find(h => parseInt(h.hour.split(':')[0], 10) === Math.floor(hour / 2) * 2) || HOURLY_OUTAGE_TREND[6];
  const hourFactor = hourObj.riskMultiplier;

  // 3. Weather impact score
  let weatherFactor = 0;
  switch (weather) {
    case 'Extreme Heat >40°C': weatherFactor = 0.28; break;
    case 'Severe Thunderstorm / Heavy Rain': weatherFactor = 0.25; break;
    case 'Harmattan Dust Storm': weatherFactor = 0.18; break;
    case 'High Humidity & Wind': weatherFactor = 0.12; break;
    default: weatherFactor = 0.02;
  }

  // 4. Grid Deficit Impact
  let gridFactor = 0;
  switch (gridStatus) {
    case 'Critical Generation Deficit (<3000MW)': gridFactor = 0.35; break;
    case 'Scheduled Load Shedding': gridFactor = 0.28; break;
    case 'Frequency Fluctuation (49.0 - 49.5 Hz)': gridFactor = 0.18; break;
    default: gridFactor = 0.03;
  }

  // 5. Transformer / Infrastructure factor
  let infraFactor = 0;
  if (transformerHealth === 'Poor / Overloaded') infraFactor += 0.18;
  else if (transformerHealth === 'Fair') infraFactor += 0.08;
  if (recentMaintenance) infraFactor -= 0.10;

  // 6. Season Factor
  let seasonFactor = 0;
  if (season === 'Peak Dry Heat') seasonFactor = 0.12;
  else if (season === 'Peak Rainy') seasonFactor = 0.10;
  else if (season === 'Harmattan') seasonFactor = 0.05;

  let totalScore = (baseRisk * 0.30) + (hourFactor * 0.15) + weatherFactor + gridFactor + infraFactor + seasonFactor;
  const probabilityPct = Math.min(98, Math.max(5, Math.round(totalScore * 100)));

  let riskLevel = 'Low Risk';
  let badgeColor = 'emerald';
  if (probabilityPct >= 75) {
    riskLevel = 'Severe Critical';
    badgeColor = 'crimson';
  } else if (probabilityPct >= 50) {
    riskLevel = 'High Risk';
    badgeColor = 'amber';
  } else if (probabilityPct >= 30) {
    riskLevel = 'Moderate Risk';
    badgeColor = 'cyan';
  }

  let estDurationHours = (probabilityPct / 20) + (weatherFactor * 2) + (gridFactor * 3);
  estDurationHours = Math.round(estDurationHours * 10) / 10;

  const peakStart = (hour + 1) % 24;
  const peakEnd = (hour + Math.round(estDurationHours)) % 24;
  const formatTime = (h) => `${h < 10 ? '0' + h : h}:00`;

  const sumVal = (gridFactor + 0.05) + (weatherFactor + 0.05) + (hourFactor * 0.1) + (infraFactor + 0.05);
  const factorGridPct = Math.round(((gridFactor + 0.05) / sumVal) * 100);
  const factorWeatherPct = Math.round(((weatherFactor + 0.05) / sumVal) * 100);
  const factorTemporalPct = Math.round(((hourFactor * 0.1) / sumVal) * 100);
  const factorInfraPct = 100 - (factorGridPct + factorWeatherPct + factorTemporalPct);

  const recommendations = {
    residential: probabilityPct > 55 
      ? 'Charge essential devices immediately. Prepare backup inverter/generators and store clean water for pump systems.'
      : 'Standard grid status expected. Keep devices charged during peak afternoon hours.',
    commercial: probabilityPct > 55
      ? 'Verify diesel generator fuel levels and switch sensitive IT hardware to UPS back-up before peak window.'
      : 'Maintain standard business operations; monitor grid frequency alerts.',
    healthcare: probabilityPct > 50
      ? 'ALERT: Critical health facilities should verify automatic Transfer Switches (ATS) for intensive care generators.'
      : 'Ensure hospital emergency generators remain in standby readiness.'
  };

  return {
    probabilityPct,
    riskLevel,
    badgeColor,
    estDurationHours,
    peakWindow: `${formatTime(peakStart)} - ${formatTime(peakEnd)}`,
    factors: {
      grid: factorGridPct,
      weather: factorWeatherPct,
      temporal: factorTemporalPct,
      infra: factorInfraPct
    },
    recommendations,
    districtName: districtObj.name,
    baselineRiskUsed: Math.round(baseRisk * 100),
    totalIncidentsRecorded: districtObj.totalIncidents || 0
  };
}

export function recalculateThresholdMetrics(threshold) {
  return getDynamicModelMetrics(threshold);
}
