import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, Lightbulb, TrendingUp } from 'lucide-react';
import Card from '../components/GlassCard.jsx';
import { getAllJudges } from '../api/verdictlens.js';

const offenseOptions = ['murder', 'robbery', 'fraud', 'assault', 'theft', 'rape', 'kidnapping', 'drug'];

const realShapFeatures = [
  { feature: 'is murder',        importance: 0.55 },
  { feature: 'num ipc sections', importance: 0.32 },
  { feature: 'judge identity',   importance: 0.17 },
  { feature: 'ipc section',      importance: 0.14 },
  { feature: 'court known',      importance: 0.12 },
  { feature: 'defendant age',    importance: 0.08 },
  { feature: 'bail granted',     importance: 0.07 },
  { feature: 'offense type',     importance: 0.07 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '10px 14px' }}>
      <p style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: 4, fontSize: 12 }}>{label}</p>
      <p style={{ color: 'var(--gold)', fontSize: 11 }}>SHAP: <strong>{payload[0]?.value?.toFixed(3)}</strong></p>
    </div>
  );
};

function cellColor(score) {
  if (score < 30) return 'rgba(77,184,144,0.8)';
  if (score < 60) return 'rgba(201,168,76,0.8)';
  return 'rgba(212,64,96,0.85)';
}

export default function BiasExplorer() {
  const [selectedOffense, setSelectedOffense] = useState('murder');
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [judges, setJudges]                   = useState([]);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    getAllJudges().then(data => { setJudges(data.judges || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const maxShap = Math.max(...realShapFeatures.map(f => f.importance));
  const judgeRows = judges.slice(0, 8).map(j => ({
    name: j.name.length > 18 ? j.name.slice(0, 16) + '…' : j.name,
    score: Math.round(j.anomaly_score), cases: j.cases, dev: j.mean_deviation,
  }));

  const highAnomaly = judges.filter(j => j.anomaly_score >= 70);
  const topJudge = judges[0];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      style={{ padding: 28, minHeight: '100vh', background: '#0C0C0C' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, borderRadius: 99, background: 'var(--grad-gold)' }} />
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>Bias Explorer</p>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.8px' }}>Systemic Disparity Analysis</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>Based on real SHAP analysis of 852 Indian High Court judgments</p>
        </div>

        {/* Offense dropdown */}
        <div style={{ position: 'relative', zIndex: 30 }}>
          <button onClick={() => setDropdownOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600,
              background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid var(--border-gold)', minWidth: 150, justifyContent: 'space-between', cursor: 'pointer' }}>
            {selectedOffense}
            <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
          </button>
          {dropdownOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', borderRadius: 14, overflow: 'hidden',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-gold)', minWidth: 160, boxShadow: '0 16px 50px rgba(0,0,0,0.5)' }}>
              {offenseOptions.map(o => (
                <button key={o} onClick={() => { setSelectedOffense(o); setDropdownOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 13, cursor: 'pointer', transition: 'background 150ms',
                    color: o === selectedOffense ? 'var(--gold)' : 'var(--text-2)',
                    background: o === selectedOffense ? 'rgba(201,168,76,0.12)' : 'transparent',
                    fontWeight: o === selectedOffense ? 700 : 400 }}>
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <Card className="p-6" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>Judge Anomaly Score Matrix</h2>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Real anomaly scores — derived from ML deviation analysis</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Normal</span>
            <div style={{ width: 80, height: 6, borderRadius: 99, background: 'linear-gradient(to right, rgba(77,184,144,0.8), rgba(201,168,76,0.8), rgba(212,64,96,0.85))' }} />
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Anomalous</span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}><div className="spinner" /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Header row */}
            <div style={{ display: 'flex', gap: 12, paddingLeft: 176, marginBottom: 4 }}>
              {['Anomaly Score', 'Cases', 'Deviation', 'Risk Level'].map(h => (
                <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>
            {judgeRows.map((j, idx) => (
              <motion.div key={j.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                <div style={{ width: 164, textAlign: 'right', paddingRight: 12, fontSize: 11, fontWeight: 600, color: 'var(--text-2)', flexShrink: 0 }}>{j.name}</div>
                {/* Score */}
                <div style={{ flex: 1, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, height: 38, background: cellColor(j.score), fontSize: 13, color: 'rgba(255,255,255,0.95)', boxShadow: `0 0 12px ${cellColor(j.score).replace('0.8', '0.4').replace('0.85', '0.4')}` }}>{j.score}</div>
                {/* Cases */}
                <div style={{ flex: 1, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{j.cases}</div>
                {/* Deviation */}
                <div style={{ flex: 1, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38,
                  background: j.dev > 0.1 ? 'rgba(212,64,96,0.12)' : j.dev < -0.1 ? 'rgba(77,184,144,0.12)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)', fontSize: 12, fontWeight: 700,
                  color: j.dev > 0.1 ? '#D44060' : j.dev < -0.1 ? '#4DB890' : 'var(--text-2)' }}>
                  {j.dev > 0 ? '+' : ''}{j.dev.toFixed(2)}
                </div>
                {/* Risk */}
                <div style={{ flex: 1, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38, background: cellColor(j.score), fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {j.score >= 70 ? 'High' : j.score >= 40 ? 'Medium' : 'Normal'}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Bottom 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* SHAP chart */}
        <Card className="p-5">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <TrendingUp size={14} style={{ color: 'var(--gold)' }} />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Global Sentencing Drivers</h2>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Real SHAP importance values from trained XGBoost model</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={realShapFeatures} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="feature" type="category" width={130} tick={{ fill: 'var(--text-2)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.05)' }} />
              <Bar dataKey="importance" name="SHAP Value" radius={[0, 5, 5, 0]}>
                {realShapFeatures.map((entry, i) => (
                  <Cell key={i} fill={`rgba(201,168,76,${0.3 + (entry.importance / maxShap) * 0.7})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Insight */}
        <Card className="p-5" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
              <Lightbulb size={13} style={{ color: 'var(--gold)' }} />
            </div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>System Insight</h2>
            <span className="pill" style={{ marginLeft: 'auto', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid var(--border-gold)' }}>Real Data</span>
          </div>

          <div style={{ borderRadius: 12, padding: 16, borderLeft: '3px solid var(--gold)', background: 'rgba(201,168,76,0.06)', marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.6 }}>
              Judge identity is the 3rd most important predictor of sentence severity — more important than bail status, defendant age, and court location.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {[
              `${highAnomaly.length} judges flagged with anomaly score above 70 — indicating statistically significant deviation from expected sentencing patterns.`,
              topJudge ? `${topJudge.name} has the highest anomaly score of ${Math.round(topJudge.anomaly_score)}/100 across ${topJudge.cases} analyzed cases.` : 'Loading judge data...',
              'For medium-range sentences, judge identity is the single most important factor — surpassing even offense type.',
              'Murder cases show the highest sentencing variance (std: 8.1 years), suggesting most inconsistency in the most serious crime category.',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, borderRadius: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginTop: 6, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65 }}>{s}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: 10, color: 'var(--text-4)' }}>Based on SHAP analysis of 852 real Indian High Court judgments</p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}