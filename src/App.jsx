import React, { useState, useEffect } from 'react';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [data, setData] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Relative path handles both Local Proxy and Vercel Deployment
    fetch(`/api/parental-legacy?day=${selectedDate}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setIsInitialLoading(false);
      })
      .catch((err) => {
        console.error("Backend connection error:", err);
        setIsInitialLoading(false);
      });
  }, [selectedDate]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#080a10] text-white flex items-center justify-center font-black italic tracking-tighter text-xl sm:text-2xl">
        INITIALIZING BIOMETRICS...
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="min-h-screen bg-[#080a10] text-red-500 flex flex-col items-center justify-center font-bold p-4 text-center">
        <span className="text-4xl mb-4">⚠️</span>
        <p>SERVER OFFLINE</p>
        <p className="text-xs opacity-50 mt-2">Please run 'node server.js' locally or check Vercel logs.</p>
      </div>
    );
  }

  const { factors, isMotherDominant } = data;
  const mTotal = factors.reduce((a, b) => a + b.mother, 0);
  const fTotal = factors.reduce((a, b) => a + b.father, 0);

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-300 p-2 sm:p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-slate-900/60 p-4 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black italic text-white uppercase tracking-tighter">PARENTAL LEGACY</h1>
            <p className="text-[9px] text-slate-500 font-black tracking-[0.3em] mt-1">REAL-TIME BIOMETRIC DATA</p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${isMotherDominant ? 'border-pink-500/50 bg-pink-500/10' : 'border-blue-500/50 bg-blue-500/10'}`}>
              <span className="text-[9px] font-black uppercase text-slate-500 hidden xs:inline">Dominant:</span>
              <span className={`text-xs font-bold uppercase ${isMotherDominant ? 'text-pink-400' : 'text-blue-400'}`}>
                {isMotherDominant ? '♀ Mother' : '♂ Father'}
              </span>
            </div>

            <div className="bg-indigo-600 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              <span className="text-[10px] font-bold uppercase text-indigo-200">Day</span>
              <input 
                type="number" min="1" max="31" value={selectedDate}
                onChange={(e) => setSelectedDate(Number(e.target.value) || 1)}
                className="bg-white/20 text-white w-10 text-center font-bold rounded-lg outline-none focus:ring-2 ring-white/30 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table Wrapper with Horizontal Scroll for Mobile */}
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase border-b border-white/10">
                <th className="p-3 sm:p-4">Life Factors</th>
                <th className={`p-3 sm:p-4 text-center ${isMotherDominant ? 'text-pink-400 bg-pink-400/5' : ''}`}>Mother</th>
                <th className={`p-3 sm:p-4 text-center ${!isMotherDominant ? 'text-blue-400 bg-blue-400/5' : ''}`}>Father</th>
                <th className="p-3 sm:p-4 text-center text-white bg-white/5">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {factors.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 sm:p-4 font-bold italic text-xs sm:text-sm md:text-base whitespace-nowrap">
                    <span className="mr-2 opacity-80">{row.icon}</span> {row.name}
                  </td>
                  <td className={`p-3 sm:p-4 text-center font-mono text-sm sm:text-lg transition-all duration-500 ${isMotherDominant ? 'text-pink-300 font-black' : 'text-pink-300/60'}`}>
                    {row.mother.toFixed(2)}
                  </td>
                  <td className={`p-3 sm:p-4 text-center font-mono text-sm sm:text-lg transition-all duration-500 ${!isMotherDominant ? 'text-blue-300 font-black' : 'text-blue-300/60'}`}>
                    {row.father.toFixed(2)}
                  </td>
                  <td className="p-3 sm:p-4 text-center font-mono font-black text-white bg-indigo-500/5">
                    {row.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-900/40 text-white font-black border-t-2 border-indigo-500/30">
                <td className="p-4 sm:p-6 text-sm sm:text-lg">TOTAL</td>
                <td className="p-4 sm:p-6 text-center text-pink-500 text-sm sm:text-xl">{mTotal.toFixed(2)}</td>
                <td className="p-4 sm:p-6 text-center text-blue-500 text-sm sm:text-xl">{fTotal.toFixed(2)}</td>
                <td className="p-4 sm:p-6 text-center bg-indigo-600 text-xl sm:text-3xl shadow-inner">
                  {(mTotal + fTotal).toFixed(0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-center text-[8px] text-slate-600 mt-6 tracking-widest uppercase italic">Optimized for All Devices</p>
      </div>
    </div>
  );
}

export default App;