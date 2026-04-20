import React, { useState } from 'react';
import { Search, Upload, Cpu } from 'lucide-react';
import IncidentFeed from './IncidentFeed';

export default function InvestigationHub() {
  const [claim, setClaim] = useState('');
  const [file, setFile] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image for the investigation.");
    
    setIsSearching(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('context_claim', claim || 'Check this anomaly');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/investigate_incident`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        alert("Investigation server returned an error.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed. Ensure backend is running.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="investigation-hub">
      {!result ? (
        <div className="hub-intro">
          <div className="hub-header">
            <h1 className="hub-title">
              Active OSINT Investigation
            </h1>
            <p className="hub-subtitle">
              Upload an anomalous image and paste the context you found online. The system will reverse-scan the public web to build a forensic dossier.
            </p>
          </div>

          <form onSubmit={handleSearch} className="hub-form glass-panel">
            <div className="form-group">
              <label className="form-label">Suspect Text Claim / Context</label>
              <textarea 
                className="form-input"
                placeholder="e.g. LeBron James just leaked this crazy dunk!"
                rows={3}
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Evidence Image</label>
              <label className="file-dropzone">
                <Upload size={32} style={{ marginBottom: '16px', color: 'var(--accent-blue)' }} />
                <span className="file-name">{file ? file.name : "Drag & Drop or Click to Browse"}</span>
                <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
              </label>
            </div>

            <button type="submit" disabled={isSearching} className="btn-primary">
              {isSearching ? <><Cpu className="loader-spin" /> Running Forensics Scan...</> : <><Search /> Launch Investigation</>}
            </button>
          </form>
        </div>
      ) : (
        <div className="investigation-report">
           <div className="report-header">
              <h2>Investigation Report <span className="report-id">#{result.incident_id}</span></h2>
              <button onClick={() => setResult(null)} className="btn-secondary">
                Start New Search
              </button>
           </div>
           
           <div className="report-summary glass-panel">
              <div className="triage-header">Aggregate Source Trust Score</div>
              <div className={`score-large ${result.overall_trust_score < 50 ? 'text-red' : 'text-emerald'}`}>
                {result.overall_trust_score}/100
              </div>
              <p className="summary-text">{result.summary}</p>
           </div>

           <div className="report-feed-section">
             <h3>Searched Disclosures & Mentions</h3>
             <IncidentFeed incidents={result.related_posts} />
           </div>
        </div>
      )}
    </div>
  );
}
