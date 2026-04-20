import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IngestionPanel() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);

    try {
      const res = await fetch('http://localhost:8000/upload_official_media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ status: 'error', message: 'Failed to connect to backend' });
    } finally {
      setIsUploading(false);
      setFile(null);
      setTitle('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <header className="page-header">
        <h2 className="page-title">Ingest Official Media</h2>
        <p className="page-subtitle">Securely hash and index original broadcast content into the local FAISS environment.</p>
      </header>

      <div className="glass-panel" style={{marginBottom: "24px"}}>
        <div className="glow-indigo" />
        
        <form onSubmit={handleUpload} style={{position: "relative", zIndex: 1}}>
          <div className="form-group">
            <label className="form-label">Media Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finals Q4 Highlight"
              className="form-input"
            />
          </div>

          <div className="file-dropzone" onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              style={{display: "none"}}
              accept="image/*"
            />
            {file ? (
              <div className="flex-center" style={{color: "var(--accent-indigo)"}}>
                <ImageIcon size={32} />
                <span style={{fontSize: "1.125rem", fontWeight: 500}}>{file.name}</span>
              </div>
            ) : (
              <div style={{textAlign: "center"}}>
                <UploadCloud size={48} color="#64748b" style={{marginBottom: "16px"}} />
                <p style={{margin: "0 0 8px 0", fontWeight: 500}}>Click to upload official asset</p>
                <p style={{margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem"}}>Supports JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={!file || isUploading} className="btn-primary">
            {isUploading ? <Loader2 size={20} className="loader-spin" /> : <UploadCloud size={20} />}
            {isUploading ? 'Generating Embeddings...' : 'Index Media'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{overflow: "hidden"}}
          >
            <div className={`status-card ${result.status === 'success' ? 'status-success' : 'status-error'}`}>
              <CheckCircle2 size={24} className={result.status === 'success' ? 'icon-success' : 'icon-error'} />
              <div>
                <h3>{result.status === 'success' ? 'Indexing Complete' : 'Error'}</h3>
                <p style={{margin: "4px 0 0 0", color: "var(--text-secondary)"}}>{result.message}</p>
                {result.id !== undefined && (
                  <p style={{margin: "8px 0 0 0", fontSize: "0.75rem", fontFamily: "monospace", color: "var(--accent-emerald)"}}>Vector ID: {result.id}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
