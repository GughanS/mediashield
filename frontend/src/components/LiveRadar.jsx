import React from 'react';

export default function LiveRadar({ incidents }) {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-10">
       <h1 className="text-3xl font-bold text-white mb-8">Live Threat Radar</h1>
       <div className="radar-wrapper shadow-2xl shadow-blue-500/10">
          <div className="radar-sweep"></div>
          {incidents && incidents.slice(0, 15).map((inc, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = ((100 - inc.trust_score) / 100) * 180; 
            const x = Math.cos(angle) * distance + 200;
            const y = Math.sin(angle) * distance + 200;
            const color = inc.trust_score < 50 ? '#ef4444' : (inc.trust_score < 80 ? '#eab308' : '#10b981');
            
            return (
              <div 
                 key={inc.feed_item.id + i} 
                 className="radar-blip"
                 style={{ left: `${x}px`, top: `${y}px`, backgroundColor: color }}
                 title={`Score: ${inc.trust_score} - ${inc.classification}`}
              ></div>
            );
          })}
       </div>
       <div className="mt-8 text-center text-gray-400 max-w-md">
         Monitoring {incidents?.length || 0} recent live network events across Reddit, Instagram, Facebook, and YouTube proxies. <br/>
         <span className="text-xs mt-2 block opacity-50">Threats appear closer to the outer/inner rings depending on severity.</span>
       </div>
    </div>
  );
}
