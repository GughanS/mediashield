import React, { useState } from 'react';
import { Shield, Globe, ScanSearch } from 'lucide-react';
import InvestigationHub from './components/InvestigationHub';

export default function App() {
  const [activeTab, setActiveTab] = useState('investigate');

  return (
    <div className="soc-container">
      <aside className="soc-sidebar glass-panel">
        <div className="sidebar-top">
           <div className="logo-section">
             <Shield className="logo-icon pulse-glow" size={36} />
             <h2>MediaShield AI</h2>
             <div className="badge-wrapper"><span className="badge-live">OSINT ENGINE <span className="blinking-dot">●</span></span></div>
           </div>
           
           <nav className="soc-nav">
             <NavItem active={activeTab === 'investigate'} onClick={() => setActiveTab('investigate')} icon={<ScanSearch size={20}/>} label="New Investigation" />
             <NavItem active={activeTab === 'sources'} onClick={() => setActiveTab('sources')} icon={<Globe size={20}/>} label="Targeted Capabilities" />
           </nav>
        </div>
        
        <div className="sidebar-bottom text-muted">
          Reverse Media Verification Engine
        </div>
      </aside>

      <main className="soc-main">
        {activeTab === 'investigate' && <InvestigationHub />}
        {activeTab === 'sources' && (
           <div className="glass-panel text-white capabilities-panel">
              <h3 className="panel-heading">On-Demand Search Capabilities</h3>
              <ul className="source-list">
                  <li><span className="dot text-emerald">●</span> Reddit /r/sports <span className="source-note">(Live Targeted Reverse Search via Crawl)</span></li>
                  <li><span className="dot text-yellow">●</span> YouTube <span className="source-note">(Mocked Dynamic Context Clustering)</span></li>
                  <li><span className="dot text-yellow">●</span> Facebook Groups <span className="source-note">(Mocked Dynamic Context Clustering)</span></li>
                  <li><span className="dot text-yellow">●</span> Instagram Reels <span className="source-note">(Mocked Dynamic Context Clustering)</span></li>
              </ul>
              <div className="info-box">
                 The OSINT crawler selectively aggregates posts based on the uploaded suspect media and context text to triangulate misinformation loops securely.
              </div>
           </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`nav-btn ${active ? 'active' : ''}`}>
      {icon} <span>{label}</span>
    </button>
  );
}
