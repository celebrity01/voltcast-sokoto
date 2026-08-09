import React, { useState, useRef, useEffect } from 'react';
import { 
  queryOpenRouterAI, getOpenRouterKey, setOpenRouterKey, OPENROUTER_MODELS 
} from '../services/openRouterService';
import { 
  Bot, Send, Sparkles, RefreshCw, Key, User, ShieldCheck, Cpu, Radio, Zap, AlertTriangle 
} from 'lucide-react';

export default function AiAssistant() {
  const [apiKeyInput, setApiKeyInput] = useState(() => getOpenRouterKey() || '');
  const [selectedModel, setSelectedModel] = useState('openrouter/auto');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `⚡ **Greetings, Grid Controller! I am VoltCast AI Agent powered by OpenRouter.**\n\nI monitor Sokoto State's 10 Local Government Areas, thermal stress telemetry, and feeder line capacity in real-time. Ask me anything about outage probabilities, heatwave risks, load shedding timetables, or grid diagnostics!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModelName, setActiveModelName] = useState('OpenRouter Auto Router');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSaveKey = () => {
    setOpenRouterKey(apiKeyInput);
    setShowKeyConfig(false);
  };

  const handleQuickAction = (promptText) => {
    setInputQuery(promptText);
    handleSendMessage(promptText);
  };

  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputQuery('');
    setLoading(true);

    const apiMessages = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await queryOpenRouterAI(apiMessages, { model: selectedModel });
    setLoading(false);

    if (response.success) {
      if (response.modelUsed) setActiveModelName(response.modelUsed);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **AI Agent Notice:** ${response.error}\n\n*Grid Diagnostics:* Sokoto regional grid currently operating at 38°C. Sokoto South and Giginya 33kV line show elevated risk (68%). Click "Key Config" to verify your OpenRouter API Key.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', height: 'calc(100vh - 120px)', minHeight: '620px' }}>
      
      {/* AI Agent Header & Model Selector Dropdown */}
      <div className="glass-card" style={{ padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #0058be)',
            padding: '0.75rem',
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                VoltCast OpenRouter AI Agent
              </h2>
              <span className="badge badge-violet">
                <Radio size={12} className="animate-pulse" /> Connected Live
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.15rem' }}>
              Smart Autonomous Grid Intelligence • Running: <b>{activeModelName}</b>
            </p>
          </div>
        </div>

        {/* Model Selection Dropdown & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.85)', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <Cpu size={15} color="#7c3aed" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.825rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {OPENROUTER_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.785rem' }}
            onClick={() => setShowKeyConfig(!showKeyConfig)}
          >
            <Key size={14} /> Key Config
          </button>
          <button 
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.785rem' }}
            onClick={() => setMessages([messages[0]])}
          >
            <RefreshCw size={14} /> Clear Chat
          </button>
        </div>
      </div>

      {/* API Key Modal Drawer */}
      {showKeyConfig && (
        <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(124, 58, 237, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Key size={18} color="#7c3aed" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 800 }}>OpenRouter API Key Configuration</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="password"
              className="form-control"
              placeholder="Enter OpenRouter API Key (sk-or-v1-...)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{ flex: 1, fontSize: '0.85rem' }}
            />
            <button className="btn-primary" style={{ fontSize: '0.825rem', padding: '0.5rem 1.25rem' }} onClick={handleSaveKey}>
              <ShieldCheck size={16} /> Save Key
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Suggestion Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflowX: 'auto', scrollbarWidth: 'none', padding: '0.2rem 0' }}>
        <span style={{ fontSize: '0.785rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          Smart Prompts:
        </span>
        <button 
          onClick={() => handleQuickAction('Run a full Sokoto regional grid diagnostic based on current 38°C ambient heat, feeder loads, and uploaded dataset.')}
          className="btn-secondary"
          style={{ fontSize: '0.785rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
        >
          ⚡ Full Grid Diagnostic
        </button>
        <button 
          onClick={() => handleQuickAction('Assess outage risk for Wamako and Sokoto South LGAs under a 43°C heatwave surge with 89% transformer load.')}
          className="btn-secondary"
          style={{ fontSize: '0.785rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
        >
          🔥 43°C Heatwave Risk Assessment
        </button>
        <button 
          onClick={() => handleQuickAction('Summarize the top primary root causes from recent Sokoto outage incident logs and recommend mitigation steps.')}
          className="btn-secondary"
          style={{ fontSize: '0.785rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
        >
          📊 Outage Root Cause Analysis
        </button>
        <button 
          onClick={() => handleQuickAction('Provide a recommended load shedding timetable for Giginya 33kV line to prevent thermal transformer failure.')}
          className="btn-secondary"
          style={{ fontSize: '0.785rem', padding: '0.4rem 0.85rem', whiteSpace: 'nowrap' }}
        >
          💡 Load Shedding Schedule
        </button>
      </div>

      {/* Main Chat Message Viewport & Input Bar */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1.25rem' }}>
        
        {/* Chat History Messages Container */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                  flexDirection: isUser ? 'row-reverse' : 'row'
                }}
              >
                {/* Avatar Icon */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isUser ? 'linear-gradient(135deg, #0058be, #06b6d4)' : 'linear-gradient(135deg, #7c3aed, #0058be)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>

                {/* Message Bubble */}
                <div style={{
                  maxWidth: '84%',
                  background: isUser 
                    ? 'linear-gradient(135deg, #0058be, #0284c7)' 
                    : 'rgba(255, 255, 255, 0.92)',
                  color: isUser ? '#ffffff' : 'var(--text-main)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${isUser ? 'rgba(255,255,255,0.3)' : 'rgba(226, 232, 240, 0.9)'}`,
                  borderRadius: isUser ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                  padding: '1rem 1.25rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isUser ? 'rgba(255,255,255,0.85)' : '#7c3aed' }}>
                      {isUser ? 'Grid Controller' : 'VoltCast OpenRouter AI'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                  
                  <div>{msg.content}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #0058be)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Bot size={18} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.85)', padding: '0.75rem 1.25rem', borderRadius: '4px 20px 20px 20px', border: '1px solid rgba(226,232,240,0.9)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Sparkles size={16} className="animate-spin" color="#7c3aed" /> VoltCast AI is generating grid analysis...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}
        >
          <input 
            type="text"
            placeholder="Ask VoltCast AI about outage risks, heatwaves, or feeder load shedding..."
            className="form-control"
            style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '9999px', fontSize: '0.9rem' }}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit"
            className="btn-primary"
            style={{ borderRadius: '9999px', padding: '0.8rem 1.4rem', fontSize: '0.9rem' }}
            disabled={loading || !inputQuery.trim()}
          >
            <Send size={16} /> Send
          </button>
        </form>

      </div>

    </div>
  );
}
