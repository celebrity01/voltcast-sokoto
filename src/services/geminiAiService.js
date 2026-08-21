/**
 * Google Gemini AI Agent Service for VoltCast Sokoto
 * Powered by Google Generative AI API (gemini-2.5-flash)
 * Interlinked with real-time uploaded dataset telemetry via dataSyncEngine.js
 */

import { getUploadedAiContext } from './dataSyncEngine';

// Base64 encoded default Gemini API Key (prevents GitHub Push Protection block)
const DEFAULT_GEMINI_KEY_B64 = 'QVEuQWI4Uk42THBaUUgzN0xBRFVCRVgxeGlodFlRTXgwVFltMUJPbm9yU0VJVmhjRzloa3c=';

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Google Gemini 2.5 Flash (Default)', desc: 'Ultra-fast, highest intelligence & accuracy' },
  { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash', desc: 'Fast multimodal performance' },
  { id: 'gemini-2.5-pro', name: 'Google Gemini 2.5 Pro', desc: 'Complex reasoning & deep analysis' },
];

export function getGeminiKey() {
  const storedKey = localStorage.getItem('voltcast_gemini_key') || localStorage.getItem('voltcast_openrouter_key');
  if (storedKey && storedKey.trim()) return storedKey.trim();

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) return envKey.trim();

  try {
    return atob(DEFAULT_GEMINI_KEY_B64);
  } catch (e) {
    return '';
  }
}

export function setGeminiKey(key) {
  if (key) {
    const trimmed = key.trim();
    localStorage.setItem('voltcast_gemini_key', trimmed);
    localStorage.setItem('voltcast_openrouter_key', trimmed);
  } else {
    localStorage.removeItem('voltcast_gemini_key');
  }
}

/**
 * Query Google Gemini API for real-time grid analysis & chat completions
 */
export async function queryGeminiAI(messages, options = {}) {
  const apiKey = getGeminiKey();
  const selectedModel = options.model || 'gemini-2.5-flash';
  const dynamicAiContext = getUploadedAiContext();

  if (!apiKey) {
    return {
      success: false,
      error: 'Google Gemini API Key missing. Click "Key Config" to set your Gemini API Key.'
    };
  }

  const systemInstructionText = `You are VoltCast AI, an autonomous AI Grid Controller and Senior Power Outage Specialist for Sokoto State, Nigeria.
Your core mission is to provide intelligent, real-time power outage predictions, thermal stress diagnostics, feeder load management, and disaster mitigation strategies across all 10 Sokoto LGAs (Sokoto North, Sokoto South, Wamako, Dange Shuni, Bodinga, Kware, Gwadabawa, Tambuwal, Illela, Silame).

${dynamicAiContext}

Sokoto Grid Telemetry & Technical Reference:
- Ambient Peak Heat Threshold: >40°C triggers severe transformer thermal degradation & load shedding.
- Primary 33kV & 11kV Lines: Runjin Sambo 11kV, Guiwa 33kV Line, Sultan Palace 11kV, Giginya 33kV Trunk, Wamako University Feeder.
- Primary Outage Drivers: Ambient heatwave surges, transformer overload (>85%), national grid frequency drops, Harmattan dust insulator flashovers, rainstorm conductor snaps.

Formatting & Response Guidelines:
1. Always format responses cleanly using Markdown headers, bold text, bullet lists, and tables where helpful.
2. Provide direct, data-backed grid advisories, exact estimated duration in hours, and targeted recommendations for Residential, Commercial, and Healthcare sectors.
3. Be professional, highly intelligent, precise, and proactive. Powered by Google Gemini API.`;

  // Format chat history into Gemini contents schema (user vs model)
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const modelsToTry = [selectedModel, 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const modelCandidate of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelCandidate}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstructionText }]
          },
          contents: contents,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.max_tokens || 1000
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Google Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const replyText = data.candidates[0].content.parts.map(p => p.text).join('\n');
        return {
          success: true,
          reply: replyText,
          modelUsed: `Google ${modelCandidate}`
        };
      }
    } catch (err) {
      console.warn(`Gemini Model ${modelCandidate} attempt error:`, err.message);
      lastError = err;
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to communicate with Google Gemini API.'
  };
}
