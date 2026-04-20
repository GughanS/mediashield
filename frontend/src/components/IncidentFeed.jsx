import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function IncidentFeed({ incidents }) {
  return (
    <div className="max-w-4xl mx-auto pt-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Real-Time Incident Feed</h2>
      {!incidents || incidents.length === 0 ? (
        <div className="text-gray-400 glass-panel p-10 text-center">Awaiting live intel... Please ensure Python backend background crawler is running.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {incidents.map((inc) => (
             <div key={inc.feed_item.id} className={`incident-card ${inc.trust_score < 50 ? 'high-risk' : ''}`}>
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', color: '#60a5fa', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>SOURCE: {inc.feed_item.source.toUpperCase()} • {new Date(inc.feed_item.timestamp * 1000).toLocaleTimeString()}</span>
                    {inc.feed_item.post_url && (
                        <a href={inc.feed_item.post_url} target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none', border: '1px solid #34d399', padding: '2px 8px', borderRadius: '4px', background: 'rgba(52, 211, 153, 0.1)' }}>
                           View Original Post →
                        </a>
                    )}
                 </div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#fff', marginBottom: '8px', marginTop: 0 }}>"{inc.feed_item.text_content}"</h3>
                 
                 <div className="flex items-center gap-2 mt-4 text-sm font-semibold mb-2">
                    {inc.trust_score < 70 ? <AlertTriangle className="text-red-500" size={16} /> : <CheckCircle className="text-green-500" size={16} />}
                    <span className={inc.trust_score < 50 ? 'text-red-500' : (inc.trust_score < 80 ? 'text-yellow-500' : 'text-green-500')}>
                      CLASSIFICATION: {inc.classification}
                    </span>
                 </div>
                 
                 <p className="text-gray-300 text-sm bg-gray-900/60 p-4 rounded-lg border border-gray-800 leading-relaxed shadow-inner">
                   <strong>Forensic Reasoning:</strong> {inc.reasoning}
                 </p>
               </div>
               
               <div className="w-48 flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Trust Score</div>
                    <div className={`text-5xl font-black mt-1 ${inc.trust_score < 50 ? 'text-red-500' : (inc.trust_score < 80 ? 'text-yellow-500' : 'text-white')}`}>
                      {inc.trust_score}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2 mt-3">
                    {inc.flags && inc.flags.map((flag, idx) => (
                      <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase font-bold px-2 py-1 rounded">
                        {flag}
                      </span>
                    ))}
                  </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
