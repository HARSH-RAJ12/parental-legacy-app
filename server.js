import express from 'express';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000; 

// 1. Middleware
app.use(cors());

// 2. Static Files Serving (Frontend files locate karne ke liye)
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Factor Data Setup
const factorsData = [
  { name: 'Genetic Inheritance', min: 9.333, max: 10.777, icon: '🧬' },
  { name: 'Constitutional Vitality', min: 8.111, max: 9.111, icon: '⚡' },
  { name: 'Mental Patterns', min: 6.111, max: 7.111, icon: '🧠' },
  { name: 'Intellectual Capacity', min: 6.333, max: 6.999, icon: '🎓' },
  { name: 'Emotional Foundation', min: 7.111, max: 7.999, icon: '❤️' },
  { name: 'Spiritual Lineage', min: 5.011, max: 6.011, icon: '✨' },
  { name: 'Soul Connections', min: 5.111, max: 6.222, icon: '🤝' }
];

const getSeededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 4. API Endpoint (Aapka Algorithm)
app.get('/api/parental-legacy', (req, res) => {
  const day = parseInt(req.query.day) || new Date().getDate();
  const isOdd = day % 2 !== 0;
  const seed = day * 555;

  let baseRows = factorsData.map((f, idx) => {
    const r1 = getSeededRandom(seed + idx);
    const r2 = getSeededRandom(seed + idx + 100);

    let val1 = f.min + (f.max - f.min) * r1;
    let val2 = f.min + (f.max - f.min) * r2;

    let mother, father;
    if (isOdd) {
      mother = Math.max(val1, val2);
      father = Math.min(val1, val2);
    } else {
      father = Math.max(val1, val2);
      mother = Math.min(val1, val2);
    }

    return { ...f, mother, father };
  });

  const currentGrandTotal = baseRows.reduce((acc, r) => acc + r.mother + r.father, 0);
  const multiplier = 100 / currentGrandTotal;

  let scaledRows = baseRows.map(r => {
    let m = Math.max(r.min, Math.min(r.max, r.mother * multiplier));
    let f = Math.max(r.min, Math.min(r.max, r.father * multiplier));
    return { ...r, mother: m, father: f };
  });

  let totalAfterScale = scaledRows.reduce((acc, r) => acc + Number(r.mother.toFixed(3)) + Number(r.father.toFixed(3)), 0);
  let diff = Math.round((100 - totalAfterScale) * 1000);

  let i = 0;
  while (diff !== 0 && i < 1000) {
    const step = diff > 0 ? 0.001 : -0.001;
    const rowIndex = i % scaledRows.length;
    let nextM = scaledRows[rowIndex].mother + step;
    if (nextM >= scaledRows[rowIndex].min && nextM <= scaledRows[rowIndex].max) {
      scaledRows[rowIndex].mother = nextM;
      diff += (diff > 0 ? -1 : 1);
    }
    i++;
  }

  res.json({
    day,
    isMotherDominant: isOdd,
    factors: scaledRows.map(r => ({
      ...r,
      mother: Number(r.mother.toFixed(3)),
      father: Number(r.father.toFixed(3)),
      total: Number((r.mother + r.father).toFixed(3))
    }))
  });
});

// 5. THE FIX: Catch-all route for UI
// Render par wildcard '*' kabhi crash karta hai, isliye hum isse simple tarike se likh rahe hain
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// 6. Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});