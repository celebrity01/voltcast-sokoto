/**
 * VoltCast Power Outage Prediction Engine
 * Integrates environmental physics, diurnal load curves, transformer health metrics,
 * and real-time uploaded dataset records via dataSyncEngine.js
 */

import { getDynamicDistricts, getDynamicModelMetrics } from './dataSyncEngine';

export function calculateOutageProbability(params) {
  const {
    districtId = 'sokoto_north',
    feeder = 'Runjin Sambo 11kV',
    temperature = 38,
    humidity = 45,
    windSpeed = 15,
    transformerLoadPct = 75,
    nationalGridDeficit = false,
    hour = 14,
  } = params;

  // Retrieve LGA profile from real-time dynamic engine
  const districts = getDynamicDistricts();
  const districtObj = districts.find(d => d.id === districtId) || districts[0];
  const baseRisk = districtObj.baselineRisk || 0.45;

  // 1. Thermal & Weather Stress Coefficient
  let weatherFactor = 0;
  if (temperature > 40) weatherFactor += 0.25;
  else if (temperature > 35) weatherFactor += 0.15;
  else if (temperature > 30) weatherFactor += 0.05;

  if (humidity < 20) weatherFactor += 0.08; // Extreme dry heat / Harmattan dust
  if (windSpeed > 35) weatherFactor += 0.12; // Storm conductor snap risk

  // 2. Substation Transformer Stress Coefficient
  let infraFactor = 0;
  if (transformerLoadPct > 85) infraFactor += 0.30;
  else if (transformerLoadPct > 70) infraFactor += 0.15;
  else infraFactor += 0.05;

  // 3. National Grid Generation Deficit Penalty
  let gridFactor = nationalGridDeficit ? 0.25 : 0.05;

  // 4. Diurnal Peak Load Hours Coefficient (13:00 - 18:00 peak heat load)
  let hourFactor = 0;
  if (hour >= 13 && hour <= 18) hourFactor = 0.18;
  else if (hour >= 19 && hour <= 22) hourFactor = 0.12;
  else hourFactor = 0.04;

  // Calculate Weighted Aggregate Risk Probability
  let rawScore = baseRisk * 0.35 + weatherFactor + infraFactor + gridFactor + hourFactor;
  let probability = Math.min(Math.max(rawScore, 0.08), 0.96);
  const probabilityPct = Math.round(probability * 100);

  // Risk Classification Levels & Colors
  let riskLevel = 'Low';
  let badgeColor = 'badge-emerald';

  if (probabilityPct >= 75) {
    riskLevel = 'Critical';
    badgeColor = 'badge-crimson';
  } else if (probabilityPct >= 55) {
    riskLevel = 'High';
    badgeColor = 'badge-crimson';
  } else if (probabilityPct >= 35) {
    riskLevel = 'Moderate';
    badgeColor = 'badge-amber';
  }

  // Estimated Duration & Peak Window
  const estDurationHours = probabilityPct > 70 ? 4.5 : (probabilityPct > 45 ? 2.5 : 1.0);
  const peakStart = Math.max(hour - 1, 0);
  const peakEnd = Math.min(hour + 3, 23);

  const formatTime = (h) => `${h < 10 ? '0' + h : h}:00`;

  const sumVal = (gridFactor + 0.05) + (weatherFactor + 0.05) + (hourFactor * 0.1) + (infraFactor + 0.05);
  const factorGridPct = Math.round(((gridFactor + 0.05) / sumVal) * 100);
  const factorWeatherPct = Math.round(((weatherFactor + 0.05) / sumVal) * 100);
  const factorTemporalPct = Math.round(((hourFactor * 0.1) / sumVal) * 100);
  const factorInfraPct = 100 - (factorGridPct + factorWeatherPct + factorTemporalPct);

  const contributingFactors = [
    { name: 'Grid Supply & Generation Deficit', pct: factorGridPct, color: 'var(--liquid-cyan)' },
    { name: 'Ambient Weather & Thermal Surge', pct: factorWeatherPct, color: 'var(--liquid-amber)' },
    { name: 'Diurnal Peak Load Hours', pct: factorTemporalPct, color: 'var(--liquid-violet)' },
    { name: 'Transformer & Infrastructure Health', pct: factorInfraPct, color: '#be123c' },
  ];

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
    contributingFactors,
    recommendations,
    districtName: districtObj.name,
    baselineRiskUsed: Math.round(baseRisk * 100),
    totalIncidentsRecorded: districtObj.totalIncidents || 0
  };
}

export function recalculateThresholdMetrics(threshold) {
  return getDynamicModelMetrics(threshold);
}
