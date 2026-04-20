import React, { useState, useRef } from 'react';
import { Target, AlertTriangle, ShieldCheck, FileWarning, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScannerPanel() {
  const [file, setFile] = useState(null);
  const [contextText, setContextText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('context_text', contextText);

    try {
      const res = await fetch('http://localhost:8000/scan_suspect_media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ status: 'Error', error: true });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <header className="page-header">
        <h2 className="page-title">Wild Media Scanner</h2>
        <p className="page-subtitle">Analyze suspects via localized FAISS search and AI Contextual Triaging.</p>
      </header>

      <div className="scanner-grid">
        {/* Left Side: Upload Form */}
        <div className="glass-panel">
             <div className="glow-rose" />
          
             <form onSubmit={handleScan} style={{position: "relative", zIndex: 1}}>
               <div className="form-group">
                 <label className="form-label">Surrounding Context (Text/Tweet)</label>
                 <textarea
                   rows={3}
                   value={contextText}
                   onChange={(e) => setContextText(e.target.value)}
                   placeholder="e.g. Found this crazy dunk on Twitter!..."
                   className="form-input"
                   style={{resize: "vertical"}}
                 />
               </div>

               <div className="file-dropzone" onClick={() => fileInputRef.current?.click()}>
                 <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} style={{display: "none"}} accept="image/*" />
                 {file ? (
                   <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", color:"var(--accent-rose)"}}>
                     <ImageIcon size={40} />
                     <span style={{fontWeight: 500, fontSize: "0.875rem"}}>{file.name}</span>
                   </div>
                 ) : (
                   <div style={{textAlign: "center"}}>
                     <Target size={40} color="#64748b" style={{margin: "0 auto 12px auto", display: "block"}} />
                     <p style={{margin: 0, fontWeight: 500, color: "#cbd5e1", fontSize: "0.875rem"}}>Upload Suspect Target</p>
                   </div>
                 )}
               </div>

               <button type="submit" disabled={!file || isScanning} className="btn-primary btn-rose">
                 {isScanning ? <Loader2 size={20} className="loader-spin" /> : <Target size={20} />}
                 {isScanning ? 'Running FAISS Check...' : 'Scan Targeting System'}
               </button>
             </form>
        </div>

        {/* Right Side: Results */}
        <AnimatePresence>
            <div className="glass-panel" style={{display: "flex", flexDirection: "column"}}>
              <h3 style={{display:"flex", alignItems:"center", gap:"8px", marginTop: 0, fontSize: "1.125rem", fontWeight: 500}}>
                <FileWarning size={20} color="#94a3b8" />
                Detection Results
              </h3>
              
              {!result && !isScanning && (
                 <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", border: "1px dashed var(--panel-border)", borderRadius: "12px", padding: "40px"}}>
                   Waiting for target data...
                 </div>
              )}

              {isScanning && (
                 <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", color: "var(--text-secondary)", background: "rgba(30,41,59,0.3)", border: "1px solid var(--panel-border)", borderRadius: "12px", padding: "40px"}}>
                     <Loader2 size={32} className="loader-spin icon-error" />
                     <p style={{opacity: 0.8}}>Vector space matching in progress...</p>
                 </div>
              )}

              {result && !result.error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                   {/* Similarity Card */}
                   <div className="score-card">
                     <div>
                       <p style={{margin: "0 0 4px 0", fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500}}>Similarity Confidence</p>
                       <h4 style={{margin: 0, fontSize: "2rem", fontWeight: "bold"}}>{result.similarity_score.toFixed(1)}<span style={{fontSize: "1.25rem", color: "var(--text-secondary)"}}>%</span></h4>
                     </div>
                     <ScoreRing score={result.similarity_score} />
                   </div>

                   {/* Status Card */}
                   <div className={`status-card ${
                     result.status.includes('High') ? 'status-error' : 
                     result.status.includes('Partial') ? 'status-warning' : 'status-success'
                   }`}>
                      {result.status.includes('High') ? <AlertTriangle size={24} className="icon-error"/> : <ShieldCheck size={24} className="icon-success"/>}
                      <div>
                        <h3>{result.status}</h3>
                        {result.match_info?.title && <p style={{margin: "4px 0 0 0", fontSize: "0.875rem", color: "#cbd5e1"}}>Matched Original: {result.match_info.title}</p>}
                      </div>
                   </div>

                   {/* Gemini AI Triage Report */}
                   {result.triage && (
                     <div className="triage-report">
                        <div className="glow-indigo" style={{top: "-50px", right: "-50px", width: "150px", height: "150px"}} />
                        <h4 className="triage-header">
                          <span className="triage-indicator" />
                          GOOGLE GEMINI
                        </h4>
                        
                        <div style={{position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "16px"}}>
                          <div>
                            <span style={{color: "var(--text-secondary)", fontSize: "0.75rem"}}>AI Classification</span>
                            <p style={{margin: "4px 0 0 0", fontWeight: 600, fontSize: "1.125rem", color: result.triage.classification?.includes('Piracy') ? "var(--accent-rose)" : "var(--accent-emerald)"}}>{result.triage.classification}</p>
                          </div>
                          <div>
                            <span style={{color: "var(--text-secondary)", fontSize: "0.75rem"}}>Forensic Reasoning</span>
                            <div className="triage-reasoning">"{result.triage.reasoning}"</div>
                          </div>
                        </div>
                     </div>
                   )}
                </motion.div>
              )}
            </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ScoreRing({ score }) {
  const color = score > 85 ? '#e11d48' : score > 50 ? '#eab308' : '#10b981';
  return (
    <svg width="60" height="60" viewBox="0 0 100 100" style={{transform: "rotate(-90deg)"}}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${score * 2.51} 251.2`} style={{transition: "all 1s ease-out"}} />
    </svg>
  );
}
