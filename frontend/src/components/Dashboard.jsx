import React from 'react';
import { ShieldAlert, Fingerprint, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard({ stats }) {
  if (!stats) return <div className="p-10 text-center text-gray-400">Loading Analytics Data Stream...</div>;

  return (
    <div className="max-w-6xl mx-auto pt-6 text-white pb-20">
      <h2 className="text-2xl font-bold mb-8 text-white">System Analytics & Threat Patterns</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
         <div className="glass-panel p-6 border-b-4 border-b-blue-500 hover:scale-[1.02] transition-transform duration-300">
           <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Entities Scanned</div>
           <div className="text-5xl font-black text-white mt-3">{stats.total_scanned}</div>
           <Search className="absolute right-6 top-6 text-blue-500/20" size={56} />
           <div className="mt-4 text-sm text-green-400 font-bold">+12% from last hour</div>
         </div>
         <div className="glass-panel p-6 border-b-4 border-b-red-500 hover:scale-[1.02] transition-transform duration-300">
           <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Anomalies Detected</div>
           <div className="text-5xl font-black text-red-500 mt-3">{stats.anomalies_detected}</div>
           <ShieldAlert className="absolute right-6 top-6 text-red-500/20" size={56} />
           <div className="mt-4 text-sm text-red-400 font-bold items-center flex gap-1"><span className="blinking-dot">●</span> 2 Active Critical Threats</div>
         </div>
         <div className="glass-panel p-6 border-b-4 border-b-green-500 hover:scale-[1.02] transition-transform duration-300">
           <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Protected Media Indexed</div>
           <div className="text-5xl font-black text-green-400 mt-3">{stats.total_indexed}</div>
           <Fingerprint className="absolute right-6 top-6 text-green-500/20" size={56} />
           <div className="mt-4 text-sm text-gray-500 font-bold flex gap-1"><span className="text-green-500">●</span> Vector DB Operational</div>
         </div>
      </div>

      <div className="glass-panel h-96 p-6 pb-12 mb-10">
        <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
          <span>Global Threat Volume Over Time</span>
          <span className="text-sm font-normal text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">Last 24 Hours</span>
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.timeseries}>
            <defs>
              <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#64748b" tickMargin={10} />
            <YAxis stroke="#64748b" tickMargin={10} />
            <Tooltip 
               contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
               itemStyle={{ fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="fake" name="Fake News / Piracy Detects" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorFake)" />
            <Area type="monotone" dataKey="safe" name="Authentic Safe Media" stroke="#10b981" strokeWidth={2} fillOpacity={0.05} fill="#10b981" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
