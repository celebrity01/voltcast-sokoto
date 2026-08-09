/**
 * OpenRouter AI Agent Service for VoltCast Sokoto
 * Interlinked with uploaded outage datasets via dataSyncEngine.js
 */

import { getUploadedAiContext } from './dataSyncEngine';

export function getOpenRouterKey() {
  return localStorage.getItem('voltcast_openrouter_key') || 
         import.meta.env.VITE_OPENROUTER_API_KEY || 
         '';
}

export function setOpenRouterKey(key) {
  if (key) {
    localStorage.setItem('voltcast_openrouter_key', key.trim());
  } else {
    localStorage.removeItem('voltcast_openrouter_key');
  }
}

/**
 * Send a chat completion request to OpenRouter API
 */
export async function queryOpenRouterAI(messages, options = {}) {
  const apiKey = getOpenRouterKey();
  const model = options.model || 'openrouter/auto';
  const dynamicAiContext = getUploadedAiContext();

  if (!apiKey) {
    return {
      success: false,
      error: 'OpenRouter API Key missing. Please click "Key Config" to enter your OpenRouter Key.'
    };
  }

  const systemInstruction = {
    role: 'system',
    content: `You are VoltCast AI, an autonomous AI Grid Controller and Power Outage Prediction Specialist for Sokoto State, Nigeria.
Your mission is to provide accurate, real-time power outage risk assessments, thermal stress diagnostics, feeder load analysis, and grid management recommendations for Sokoto LGAs (Sokoto North, Sokoto South, Wamako, Dange Shuni, Bodinga, Kware, Gwadabawa, Tambuwal, Illela, Silame).

${dynamicAiContext}

Context Data:
- Regional Base Temperature: 38°C to 44°C during peak dry heat.
- Primary Feeders: Runjin Sambo 11kV, Guiwa 33kV Line, Sultan Palace 11kV, Giginya 33kV Trunk.
- Failure Drivers: Thermal transformer overload, scheduled load shedding, Harmattan dust faults, conductor snaps.

Always provide concise, professional, actionable, and data-backed grid advisories based on the real uploaded dataset.`
  };

  const fullMessages = [systemInstruction, ...messages];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/celebrity01/voltcast-sokoto',
        'X-Title': 'VoltCast Sokoto Electricity Outage Predictor',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: fullMessages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        success: true,
        reply: data.choices[0].message.content,
        modelUsed: data.model || model
      };
    } else {
      throw new Error('Invalid response structure from OpenRouter API');
    }
  } catch (err) {
    console.error('OpenRouter AI Error:', err);
    return {
      success: false,
      error: err.message || 'Failed to communicate with OpenRouter AI agent.'
    };
  }
}
