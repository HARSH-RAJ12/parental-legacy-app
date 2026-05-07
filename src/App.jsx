import React, { useState, useEffect } from 'react';

// Exact Min/Max limits for individual parent values as per your screenshots
const BASE_FACTORS = [
  { name: "Genetic Inheritance", icon: "🧬", min: 9.0, max: 11.5 },
  { name: "Constitutional Vitality", icon: "⚡", min: 8.0, max: 10.0 },
  { name: "Mental Patterns", icon: "🧠", min: 6.0, max: 7.5 },
  { name: "Intellectual Capacity", icon: "🎓", min: 6.0, max: 7.5 },
  { name: "Emotional Foundation", icon: "❤️", min: 7.0, max: 8.5 },
  { name: "Spiritual Lineage", icon: "✨", min: 5.0, max: 6.5 },
  { name: "Soul Connections", icon: "🤝", min: 5.0, max: 6.5 },
];

function App() {
  const [day, setDay] = useState(new Date().getDate());
  const [displayData, setDisplayData] = useState([]);
  const [isMotherDominant, setIsMotherDominant] = useState(true);

  useEffect(() => {
    calculateLegacy(day);
  }, [day]);

  const calculateLegacy = (selectedDay) => {
    // Logic: Odd days -> Mother Dominant, Even days -> Father Dominant
    const isMomsTurn = selectedDay % 2 !== 0; 
    setIsMotherDominant(isMomsTurn);

    // 1. Generate values strictly within [Min, Max] limits
    let rawFactors = BASE_FACTORS.map(f => {
      const range = f.max - f.min;
      const seed = (selectedDay * 7) % 100; // Deterministic seed for reproducible values
      const offset = seed / 100;
      
      // Calculate two distinct values inside the specific range
      let val1 = f.min + (range * 0.25) + (offset * range * 0.2);
      let val2 = f.min + (range * 0.55) + (offset * range * 0.2);

      // Assign values based on dominance
      let mother = isMomsTurn ? Math.max(val1, val2) : Math.min(val1, val2);
      let father = isMomsTurn ? Math.min(val1, val2) : Math.max(val1, val2);

      return { ...f, mother, father, total: mother + father };
    });

    // 2. Normalization: Ensuring Global Sum is exactly 100.000
    const currentSum = rawFactors.reduce((acc, f) => acc + f.total, 0);
    const multiplier = 100 / currentSum;

    const finalFactors = rawFactors.map(f => {
      const normalizedM = f.mother * multiplier;
      const normalizedF = f.father * multiplier;
      
      return {
        ...f,
        mother: normalizedM,
        father: normalizedF,
        total: normalizedM + normalizedF
      };
    });

    setDisplayData(finalFactors);
  };

  const totals = displayData.reduce(
    (acc, f) => ({ m: acc.m + f.mother, f: acc.f + f.father, t: acc.t + f.total }),
    { m: 0, f: 0, t: 0 }
  );

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-300 p-4 md:p-10 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl bg-[#11131a] p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col sm:row justify-between items-center mb-12 gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">PARENTAL LEGACY</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-5 py-2 rounded-xl text-[11px] font-black border transition-all duration-300 ${
              isMotherDominant ? 'border-pink-500/30 text-pink-400 bg-pink-500/5' : 'border-blue-500/30 text-blue-400 bg-blue-500/5'
            }`}>
              {isMotherDominant ? '♀ MOTHER DOMINANT' : '♂ FATHER DOMINANT'}
            </div>
            <div className="bg-indigo-600 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
              <span className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Day</span>
              <input 
                type="number" min="1" max="31" value={day}
                onChange={(e) => setDay(Number(e.target.value) || 1)}
                className="bg-white/10 text-white w-12 text-center font-bold rounded-lg outline-none focus:ring-2 ring-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-600 text-[11px] font-bold uppercase border-b border-white/5">
                <th className="p-5 whitespace-nowrap">Life Factors</th>
                <th className="p-5 text-center">Mother</th>
                <th className="p-5 text-center">Father</th>
                <th className="p-5 text-center bg-indigo-500/10 text-indigo-300">Total</th>
                <th className="p-5 text-center text-slate-500 tracking-wider">Minimum</th>
                <th className="p-5 text-center text-slate-500 tracking-wider">Maximum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/10">
              {displayData.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-bold text-white text-sm sm:text-base whitespace-nowrap">
                    <span className="mr-3 opacity-60 group-hover:opacity-100 transition-opacity">{row.icon}</span> 
                    {row.name}
                  </td>
                  <td className={`p-5 text-center font-mono text-sm sm:text-base ${isMotherDominant ? 'text-pink-400 font-bold' : 'text-pink-400/40'}`}>
                    {row.mother.toFixed(3)}
                  </td>
                  <td className={`p-5 text-center font-mono text-sm sm:text-base ${!isMotherDominant ? 'text-blue-400 font-bold' : 'text-blue-400/40'}`}>
                    {row.father.toFixed(3)}
                  </td>
                  {/* Highlighted Total Column */}
                  <td className="p-5 text-center font-mono font-black text-white bg-indigo-500/10 text-lg sm:text-xl">
                    {row.total.toFixed(3)}
                  </td>
                  {/* Increased Size for Min/Max Range */}
                  <td className="p-5 text-center font-mono text-slate-500 text-sm italic">
                    {row.min.toFixed(3)}
                  </td>
                  <td className="p-5 text-center font-mono text-slate-500 text-sm italic">
                    {row.max.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-600/30 text-white font-black border-t-2 border-indigo-500/50">
                <td className="p-6 sm:p-10 text-base sm:text-xl tracking-tighter">TOTAL BIOMETRIC SUM</td>
                <td className="p-6 sm:p-10 text-center text-pink-500 text-lg sm:text-2xl">{totals.m.toFixed(3)}</td>
                <td className="p-6 sm:p-10 text-center text-blue-500 text-lg sm:text-2xl">{totals.f.toFixed(3)}</td>
                <td className="p-6 sm:p-10 text-center bg-indigo-600 text-3xl sm:text-5xl font-black shadow-[inset_0_4px_20px_rgba(0,0,0,0.4)]">
                  {Math.round(totals.t)}
                </td>
                <td colSpan="2" className="p-6 sm:p-10"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;