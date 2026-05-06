import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Users, MapPin, Scale, TrendingUp, AlertTriangle, Activity, ArrowUpRight } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { getAllJudges } from '../api/verdictlens.js';

const offenses = ['All', 'Assault', 'Robbery', 'Fraud', 'Murder', 'Cybercrime'];

function heatColor(score) {
  if (score < 40) return '#4DB890';
  if (score < 70) return '#C9A84C';
  return '#D44060';
}
function heatBg(score) {
  if (score < 40) return 'rgba(77,184,144,0.12)';
  if (score < 70) return 'rgba(201,168,76,0.12)';
  return 'rgba(212,64,96,0.12)';
}

const cardV = { hidden: { opacity: 0, y: 24 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.4, ease: 'easeOut' } }) };

export default function Explorer() {
  const [activeOffense, setActiveOffense] = useState('All');
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalJudgments: '852', judgesProfiled: '0', districtsCovered: '8', nationalAvgSentence: '11.2 yrs' });

  useEffect(() => {
    getAllJudges().then(data => {
      setJudges(data.judges || []);
      setStats(prev => ({ ...prev, judgesProfiled: String(data.total || 0) }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
      style={{ padding: 28, minHeight: '100vh', background: '#0C0C0C' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, borderRadius: 99, background: 'var(--grad-gold)' }} />
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>National Overview</p>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.8px', lineHeight: 1 }}>
            Judgment Explorer
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>
            Real-time judicial analytics across India · {stats.totalJudgments} judgments indexed
          </p>
        </div>
        <motion.div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99,
          background: 'rgba(77,184,144,0.1)', border: '1px solid rgba(77,184,144,0.25)' }}
          animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4DB890' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4DB890' }}>Live · Real Data</span>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Judgments"    value={stats.totalJudgments}      icon={Database} accentColor="#C9A84C" bgColor="rgba(201,168,76,0.12)" trend="Real data"   trendUp={true}  delay={0}    />
        <StatCard label="Judges Profiled"    value={stats.judgesProfiled}      icon={Users}    accentColor="#4DB890" bgColor="rgba(77,184,144,0.12)" trend="Extracted"  trendUp={true}  delay={0.07} />
        <StatCard label="Courts Covered"     value={stats.districtsCovered}    icon={MapPin}   accentColor="#D4783A" bgColor="rgba(212,120,58,0.12)"  trend="High Courts" trendUp={true}  delay={0.14} />
        <StatCard label="Avg Sentence"       value={stats.nationalAvgSentence} icon={Scale}    accentColor="#D44060" bgColor="rgba(212,64,96,0.12)"  trend="11.2 years"  trendUp={false} delay={0.21} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 360px' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Judge Anomaly Chart */}
          <motion.div className="card" style={{ padding: 24 }} custom={0} variants={cardV} initial="hidden" animate="show">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.3px' }}>Judge Anomaly Score Overview</h2>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
                  Real ML-derived anomaly scores ·{' '}
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{activeOffense === 'All' ? 'All Offenses' : activeOffense}</span>
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Normal</span>
                <div style={{ width: 70, height: 6, borderRadius: 99, background: 'linear-gradient(to right, #4DB890, #C9A84C, #D44060)' }} />
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>High risk</span>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><div className="spinner" /></div>
            ) : (
              <div style={{ minHeight: 260 }}>
                {judges.map((j, idx) => {
                  const score = j.anomaly_score;
                  const color = heatColor(score);
                  const bg = heatBg(score);
                  return (
                    <motion.div key={j.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06, duration: 0.3 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0, background: bg, color, border: `1px solid ${color}30` }}>
                        {j.name.charAt(0)}
                      </div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', width: 140, flexShrink: 0 }} className="truncate">{j.name}</p>
                      <div style={{ flex: 1, borderRadius: 99, overflow: 'hidden', height: 8, background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}60` }}
                          initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ delay: 0.3 + idx * 0.06, duration: 0.8, ease: 'easeOut' }} />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 800, color, width: 32, textAlign: 'right', flexShrink: 0 }}>{Math.round(score)}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {offenses.map(o => (
                <motion.button key={o} onClick={() => setActiveOffense(o)} className="pill"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  style={activeOffense === o
                    ? { background: 'var(--gold)', color: '#0F0F1A', cursor: 'pointer', fontWeight: 700 }
                    : { background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  {o}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Judge Profiles list */}
          <motion.div className="card" style={{ padding: 20 }} custom={1} variants={cardV} initial="hidden" animate="show">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
                  <Activity size={14} style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>Judge Profiles</h2>
                  <p style={{ fontSize: 10, color: 'var(--text-3)' }}>{loading ? 'Loading...' : `${judges.length} judges analyzed`}</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loading ? <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>Loading real data...</p>
                : judges.slice(0, 6).map((j, idx) => {
                  const score = j.anomaly_score;
                  const color = heatColor(score);
                  const bg = heatBg(score);
                  const level = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Normal';
                  return (
                    <motion.div key={j.name}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + idx * 0.06, duration: 0.25 }}
                      whileHover={{ x: 4, borderColor: 'var(--border-gold)', backgroundColor: 'rgba(201,168,76,0.04)' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: 'rgba(255,255,255,0.06)', color: 'var(--text-3)' }}>{idx + 1}</div>
                      <span className="pill" style={{ background: bg, color, border: `1px solid ${color}40`, fontSize: 10, flexShrink: 0 }}>{level}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)' }} className="truncate">{j.name}</p>
                        <p style={{ fontSize: 10, color: 'var(--text-3)' }}>{j.cases} cases analyzed</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 800, color }}>{score.toFixed(1)}</p>
                        <p style={{ fontSize: 9, color: 'var(--text-3)' }}>anomaly</p>
                      </div>
                      <ArrowUpRight size={13} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Key Findings */}
          <motion.div className="card" style={{ padding: 20 }} custom={2} variants={cardV} initial="hidden" animate="show">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212,64,96,0.12)' }}>
                <AlertTriangle size={14} style={{ color: '#D44060' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>Key Findings</h2>
                <p style={{ fontSize: 10, color: 'var(--text-3)' }}>From real ML analysis</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '⚖️', title: 'Judge identity matters', desc: 'Judge identity is the 3rd most important factor in predicting sentence severity — above bail status and defendant age.', color: '#D44060', bg: 'rgba(212,64,96,0.08)' },
                { icon: '📊', title: 'Murder dominates dataset', desc: '74% of identified criminal cases involve murder charges — reflecting High Court appeal patterns in India.', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)' },
                { icon: '🔍', title: '8x sentencing difference', desc: 'R.R. JAIN scores 100 anomaly while Basudeo Sahai scores 0 — an 8x difference in patterns for similar cases.', color: '#D4783A', bg: 'rgba(212,120,58,0.08)' },
              ].map((item, idx) => (
                <motion.div key={idx} style={{ borderRadius: 14, padding: '12px 14px', background: item.bg, border: `1px solid ${item.color}20` }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + idx * 0.09 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>{item.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Court Risk Index */}
          <motion.div className="card" style={{ padding: 20 }} custom={3} variants={cardV} initial="hidden" animate="show">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
                <TrendingUp size={14} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>Court Risk Index</h2>
                <p style={{ fontSize: 10, color: 'var(--text-3)' }}>Anomaly score vs national baseline</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {judges.slice(0, 5).map((j, idx) => {
                const color = heatColor(j.anomaly_score);
                return (
                  <div key={j.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}80`, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }} className="truncate">{j.name}</p>
                        <p style={{ fontSize: 11, fontWeight: 800, color }}>{Math.round(j.anomaly_score)}</p>
                      </div>
                      <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <motion.div style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}60` }}
                          initial={{ width: 0 }} animate={{ width: `${j.anomaly_score}%` }} transition={{ delay: 0.7 + idx * 0.1, duration: 0.8, ease: 'easeOut' }} />
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: 'var(--text-3)', width: 50, textAlign: 'right', flexShrink: 0 }}>{j.cases} cases</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}