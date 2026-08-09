import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Download, FileText, PlusCircle, RefreshCw, Database, Layers, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { SOKOTO_DISTRICTS } from '../services/mockDataGenerator';

export default function DataUploader({ onDataUploaded, onAddManualLog }) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'manual'
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const fileInputRef = useRef(null);

  // Manual Report Form State
  const [manualForm, setManualForm] = useState({
    district: 'Sokoto North',
    feeder: 'Runjin Sambo 11kV',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    durationHours: 2.5,
    cause: 'Extreme Ambient Temperature Surge',
    status: 'Resolved',
    impactLevel: 'Medium'
  });

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Parse CSV / JSON File
  const processFile = (file) => {
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'json', 'txt'].includes(fileExt)) {
      setUploadStatus({
        type: 'error',
        message: 'Unsupported file format. Please upload a CSV, JSON, or TXT dataset.'
      });
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        let records = [];

        if (fileExt === 'json') {
          records = JSON.parse(text);
        } else {
          // Parse CSV
          const lines = text.split('\n').map(l => l.trim()).filter(l => l);
          if (lines.length < 2) {
            throw new Error('CSV file must contain a header row and at least one data row.');
          }
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          
          records = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const rowObj = {};
            headers.forEach((h, idx) => {
              rowObj[h] = values[idx] || '';
            });
            return rowObj;
          });
        }

        setParsedData(records);
        setUploadStatus({
          type: 'success',
          message: `Successfully validated ${records.length} outage incident records from "${file.name}".`
        });
      } catch (err) {
        console.error(err);
        setUploadStatus({
          type: 'error',
          message: `Error parsing file: ${err.message}`
        });
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Download Sample Template CSV
  const downloadSampleCSV = () => {
    const csvContent = `District,Feeder Line,Date,Time,Duration (hrs),Root Cause,Impact Level,Status
Sokoto North,Runjin Sambo 11kV,2026-08-01,14:30,2.5,Extreme Ambient Heat >40°C,High,Resolved
Wamako,Guiwa 33kV Line,2026-08-02,16:00,4.0,Transformer Overload,Critical,Resolved
Dange Shuni,Giginya 33kV Trunk,2026-08-03,11:15,1.8,Scheduled Load Shedding,Medium,Resolved
Sokoto South,Sultan Palace 11kV,2026-08-04,18:45,3.2,Harmattan Dust Storm Feeder Fault,High,Resolved
Bodinga,Bodinga Rural Feeder,2026-08-05,13:20,5.0,Line Conductor Snap,High,Resolved`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sokoto_outage_data_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Commit Uploaded Records to App Data State
  const handleConfirmImport = () => {
    if (!parsedData || parsedData.length === 0) return;
    if (onDataUploaded) {
      onDataUploaded(parsedData);
    }
    setUploadStatus({
      type: 'success',
      message: `🎉 Imported ${parsedData.length} records into the VoltCast Sokoto regional engine!`
    });
    setParsedData(null);
    setUploadedFile(null);
  };

  // Submit Manual Single Outage Incident Report
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const newIncident = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      district: manualForm.district,
      feeder: manualForm.feeder,
      date: manualForm.date,
      time: manualForm.time,
      duration: `${manualForm.durationHours} hrs`,
      cause: manualForm.cause,
      status: manualForm.status,
      impact: manualForm.impactLevel
    };

    if (onAddManualLog) {
      onAddManualLog(newIncident);
    }

    setUploadStatus({
      type: 'success',
      message: `✅ Successfully reported manual outage incident ${newIncident.id} for ${manualForm.district}!`
    });

    // Reset Form
    setManualForm({
      district: 'Sokoto North',
      feeder: 'Runjin Sambo 11kV',
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      durationHours: 2.5,
      cause: 'Extreme Ambient Temperature Surge',
      status: 'Resolved',
      impactLevel: 'Medium'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0058be, #06b6d4)',
            padding: '0.75rem',
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(0, 88, 190, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UploadCloud size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Outage Data Ingestion & Reporting
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.15rem' }}>
              Upload historical CSV/JSON dataset files or log manual grid incident reports to enhance prediction accuracy.
            </p>
          </div>
        </div>

        <button 
          className="btn-secondary"
          style={{ fontSize: '0.825rem', padding: '0.55rem 1rem' }}
          onClick={downloadSampleCSV}
        >
          <Download size={15} /> Download CSV Template
        </button>
      </div>

      {/* Mode Selector Tabs (Batch File Upload vs Manual Incident Report) */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('file')}
          className={`nav-tab ${activeTab === 'file' ? 'active' : ''}`}
          style={{ padding: '0.65rem 1.25rem' }}
        >
          <FileSpreadsheet size={18} /> Batch File Ingestion (CSV / JSON)
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`nav-tab ${activeTab === 'manual' ? 'active' : ''}`}
          style={{ padding: '0.65rem 1.25rem' }}
        >
          <PlusCircle size={18} /> Log Single Incident Report
        </button>
      </div>

      {/* Upload Status Banner */}
      {uploadStatus && (
        <div style={{
          padding: '0.85rem 1.2rem',
          borderRadius: '14px',
          background: uploadStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(218, 52, 55, 0.12)',
          border: `1px solid ${uploadStatus.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(218, 52, 55, 0.35)'}`,
          color: uploadStatus.type === 'success' ? '#047857' : '#be123c',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.875rem',
          fontWeight: 700
        }}>
          {uploadStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {/* Mode 1: Batch File Ingestion */}
      {activeTab === 'file' && (
        <div style={{ display: 'grid', gridTemplateColumns: parsedData ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
          
          {/* Drag & Drop File Zone */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? 'var(--liquid-cyan)' : 'rgba(203, 213, 225, 0.9)'}`,
                borderRadius: '20px',
                padding: '2.5rem 1.5rem',
                background: dragActive ? 'rgba(0, 88, 190, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.85rem'
              }}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv, .json, .txt" 
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 88, 190, 0.15), rgba(6, 182, 212, 0.15))',
                padding: '1.25rem',
                borderRadius: '50%',
                boxShadow: '0 8px 25px rgba(0, 88, 190, 0.12)'
              }}>
                <UploadCloud size={42} color="#0058be" />
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Drag & Drop Outage Dataset File
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Supports <b>CSV</b>, <b>JSON</b>, or plain text spreadsheet formats (up to 50MB)
                </p>
              </div>

              <button className="btn-primary" style={{ fontSize: '0.825rem', padding: '0.55rem 1.25rem', marginTop: '0.5rem' }}>
                Browse Files
              </button>
            </div>
          </div>

          {/* Parsed Data Preview Panel */}
          {parsedData && (
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} color="var(--liquid-cyan)" />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Parsed Dataset Preview
                    </h3>
                  </div>
                  <span className="badge badge-cyan">{parsedData.length} Incidents</span>
                </div>

                {/* Sample Records Table */}
                <div style={{ overflowX: 'auto', maxHeight: '240px', overflowY: 'auto', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.785rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(241, 245, 249, 0.9)', borderBottom: '1px solid rgba(203, 213, 225, 0.8)' }}>
                        <th style={{ padding: '0.55rem 0.75rem', color: 'var(--text-muted)' }}>District</th>
                        <th style={{ padding: '0.55rem 0.75rem', color: 'var(--text-muted)' }}>Feeder</th>
                        <th style={{ padding: '0.55rem 0.75rem', color: 'var(--text-muted)' }}>Date</th>
                        <th style={{ padding: '0.55rem 0.75rem', color: 'var(--text-muted)' }}>Cause</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 5).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.6)' }}>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>{row.District || row.district || 'Sokoto'}</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>{row['Feeder Line'] || row.feeder || '11kV'}</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>{row.Date || row.date || '2026-08-01'}</td>
                          <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>{row['Root Cause'] || row.cause || 'Surge'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '0.85rem' }}
                  onClick={handleConfirmImport}
                >
                  <ShieldCheck size={16} /> Import Records into Engine
                </button>
                <button 
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => { setParsedData(null); setUploadedFile(null); setUploadStatus(null); }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Mode 2: Manual Incident Report Form */}
      {activeTab === 'manual' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Log Single Power Outage Incident
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Submit a verified field report of an outage occurrence to calibrate real-time probability models.
            </p>
          </div>

          <form onSubmit={handleManualSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            
            {/* District */}
            <div className="form-group">
              <label className="form-label">Target LGA District</label>
              <select 
                className="form-control"
                value={manualForm.district}
                onChange={(e) => setManualForm({ ...manualForm, district: e.target.value })}
              >
                {SOKOTO_DISTRICTS.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Feeder Line */}
            <div className="form-group">
              <label className="form-label">Feeder Line</label>
              <input 
                type="text" 
                className="form-control"
                value={manualForm.feeder}
                onChange={(e) => setManualForm({ ...manualForm, feeder: e.target.value })}
                placeholder="e.g. Runjin Sambo 11kV"
                required
              />
            </div>

            {/* Incident Date */}
            <div className="form-group">
              <label className="form-label">Incident Date</label>
              <input 
                type="date" 
                className="form-control"
                value={manualForm.date}
                onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                required
              />
            </div>

            {/* Outage Time */}
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input 
                type="time" 
                className="form-control"
                value={manualForm.time}
                onChange={(e) => setManualForm({ ...manualForm, time: e.target.value })}
                required
              />
            </div>

            {/* Duration */}
            <div className="form-group">
              <label className="form-label">Outage Duration (Hours)</label>
              <input 
                type="number" 
                step="0.5"
                min="0.5"
                max="48"
                className="form-control"
                value={manualForm.durationHours}
                onChange={(e) => setManualForm({ ...manualForm, durationHours: parseFloat(e.target.value) })}
                required
              />
            </div>

            {/* Primary Cause */}
            <div className="form-group">
              <label className="form-label">Identified Primary Cause</label>
              <select 
                className="form-control"
                value={manualForm.cause}
                onChange={(e) => setManualForm({ ...manualForm, cause: e.target.value })}
              >
                <option value="Extreme Ambient Temperature Surge">Extreme Ambient Temperature Surge (&gt;40°C)</option>
                <option value="Transformer Overload & Thermal Failure">Transformer Overload & Thermal Failure</option>
                <option value="Scheduled Load Shedding">Scheduled Load Shedding</option>
                <option value="Harmattan Dust Storm Feeder Fault">Harmattan Dust Storm Feeder Fault</option>
                <option value="Heavy Rainstorm Conductor Snap">Heavy Rainstorm Conductor Snap</option>
                <option value="Substation Lightning Strike">Substation Lightning Strike</option>
              </select>
            </div>

            {/* Impact Level */}
            <div className="form-group">
              <label className="form-label">Impact Severity Level</label>
              <select 
                className="form-control"
                value={manualForm.impactLevel}
                onChange={(e) => setManualForm({ ...manualForm, impactLevel: e.target.value })}
              >
                <option value="Low">Low (Localized Feeder Line)</option>
                <option value="Medium">Medium (District Substation Area)</option>
                <option value="High">High (Major Municipal LGA Sector)</option>
                <option value="Critical">Critical (Statewide Grid Collapse)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div style={{ gridColumn: '1 / -1', marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" type="submit" style={{ fontSize: '0.9rem', padding: '0.7rem 1.75rem' }}>
                <PlusCircle size={18} /> Submit Incident Field Report
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
