import React, { useState, useEffect } from 'react';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [data, setData] = useState(null);
  // Pehli baar load hone ke liye state
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Relative path use kar rahe hain taaki Local aur Vercel dono pe chale
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

  // Sirf tab dikhega jab app pehli baar khulega
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#080a10] text-white flex items-center justify-center font-black italic tracking-tighter text-2xl">
        INITIALIZING BIOMETRICS...
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="min-h-screen bg-[#080a10] text-red-500 flex items-center justify-center font-bold">
        ⚠️ SERVER OFFLINE: Please run 'node server.js'
      </div>
    );
  }

  const { factors, isMotherDominant } = data;
  const mTotal = factors.reduce((a, b) => a + b.mother, 0);
  const fTotal = factors.reduce((a, b) => a + b.father, 0);

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-300 p-4 md:p-12">
      <div className="max-w-6xl mx-auto bg-slate-900/60 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">PARENTAL LEGACY</h1>
            <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] mt-1">REAL-TIME BIOMETRIC DATA</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${isMotherDominant ? 'border-pink-500/50 bg-pink-500/10' : 'border-blue-500/50 bg-blue-500/10'}`}>
              <span className="text-[10px] font-black uppercase text-slate-500">Dominant:</span>
              <span className={`text-sm font-bold uppercase ${isMotherDominant ? 'text-pink-400' : 'text-blue-400'}`}>
                {isMotherDominant ? '♀ Mother' : '♂ Father'}
              </span>
            </div>

            <div className="bg-indigo-600 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-500/20">
              <span className="text-xs font-bold uppercase text-indigo-200">Day</span>
              <input 
                type="number" min="1" max="31" value={selectedDate}
                onChange={(e) => setSelectedDate(Number(e.target.value) || 1)}
                className="bg-white/20 text-white w-12 text-center font-bold rounded-lg outline-none focus:ring-2 ring-white/30"
              />
            </div>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-[10px] font-black uppercase border-b border-white/10">
                <th className="p-4">Life Factors</th>
                <th className={`p-4 text-center transition-colors duration-500 ${isMotherDominant ? 'text-pink-400 bg-pink-400/5' : ''}`}>Mother</th>
                <th className={`p-4 text-center transition-colors duration-500 ${!isMotherDominant ? 'text-blue-400 bg-blue-400/5' : ''}`}>Father</th>
                <th className="p-4 text-center text-white bg-white/5">Total (M+F)</th>
                <th className="p-4 text-center">Minimum</th>
                <th className="p-4 text-center">Maximum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {factors.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold italic text-sm md:text-base whitespace-nowrap">
                    <span className="mr-2 opacity-80">{row.icon}</span> {row.name}
                  </td>
                  <td className={`p-4 text-center font-mono text-lg md:text-xl transition-all duration-500 ${isMotherDominant ? 'text-pink-300 font-black' : 'text-pink-300/60'}`}>
                    {row.mother.toFixed(3)}
                  </td>
                  <td className={`p-4 text-center font-mono text-lg md:text-xl transition-all duration-500 ${!isMotherDominant ? 'text-blue-300 font-black' : 'text-blue-300/60'}`}>
                    {row.father.toFixed(3)}
                  </td>
                  <td className="p-4 text-center font-mono font-black text-white bg-indigo-500/5 transition-all duration-500">
                    {row.total.toFixed(3)}
                  </td>
                  <td className="p-4 text-center text-slate-600 font-mono text-xs">{row.min.toFixed(3)}</td>
                  <td className="p-4 text-center text-slate-600 font-mono text-xs">{row.max.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-900/40 text-white font-black border-t-2 border-indigo-500/30">
                <td className="p-6 text-lg">OVERALL TOTAL</td>
                <td className="p-6 text-center text-pink-500 text-xl md:text-2xl transition-all duration-500">{mTotal.toFixed(3)}</td>
                <td className="p-6 text-center text-blue-500 text-xl md:text-2xl transition-all duration-500">{fTotal.toFixed(3)}</td>
                <td className="p-6 text-center bg-indigo-600 text-3xl md:text-4xl shadow-inner transition-all duration-500">
                  {(mTotal + fTotal).toFixed(0)}.000
                </td>
                <td colSpan="2" className="hidden md:table-cell"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;