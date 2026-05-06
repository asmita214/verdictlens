import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, AlertCircle, ChevronLeft, ArrowRight } from 'lucide-react';
import AnomalyGauge from '../components/AnomalyGauge.jsx';
import { getAllJudges, getJudgeProfile } from '../api/verdictlens.js';

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
function getLevel(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '10px 14px' }}>
      <p style={{ fontWeight: 800, color: 'var(--text-1)', marginBottom: 6, fontSize: 12 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{p.name}: <strong style={{ color: 'var(--text-1)' }}>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

const cardV = { hidden: { opacity: 0, y: 20 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.35 } }) };

export default function Judges() {
  const [judges, setJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    getAllJudges().then(data => { setJudges(data.judges || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function handleJudgeClick(judge) {
    setSelectedJudge(judge); setProfileLoading(true);
    try { const data = await getJudgeProfile(judge.name); setProfile(data); }
    catch { setProfile(null); }
    finally { setProfileLoading(false); }
  }

  if (!selectedJudge) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 28, minHeight: '100vh', background: '#0C0C0C' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, borderRadius: 99, background: 'var(--grad-gold)' }} />
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>Judge Profiles</p>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.8px' }}>All Judges</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>
            {loading ? 'Loading...' : `${judges.length} judges analyzed from real High Court data`}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><div className="spinner" /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {judges.map((j, idx) => {
              const color = heatColor(j.anomaly_score);
              const bg = heatBg(j.anomaly_score);
              const level = getLevel(j.anomaly_score);
              return (
                <motion.div key={j.name} className="card" style={{ padding: 20, cursor: 'pointer' }}
                  custom={idx} variants={cardV} initial="hidden" animate="show"
                  whileHover={{ y: -3, borderColor: `${color}40` }}
                  onClick={() => handleJudgeClick(j)}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${bg.replace('0.12', '0.25')}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Avatar */}
                    <div style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, flexShrink: 0, background: bg, color, border: `1px solid ${color}30`, fontFamily: "'Playfair Display', serif" }}>
                      {j.name.charAt(0)}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>{j.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Indian High Court · {j.cases} cases analyzed</p>
                    </div>
                    {/* Score */}
                    <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 16 }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-1px' }}>{Math.round(j.anomaly_score)}</p>
                      <p style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>anomaly score</p>
                    </div>
                    {/* Bar */}
                    <div style={{ width: 100, flexShrink: 0 }}>
                      <div style={{ borderRadius: 99, overflow: 'hidden', height: 6, background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div style={{ height: '100%', borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}60` }}
                          initial={{ width: 0 }} animate={{ width: `${j.anomaly_score}%` }} transition={{ delay: idx * 0.08, duration: 0.8, ease: 'easeOut' }} />
                      </div>
                      <p style={{ fontSize: 10, color, fontWeight: 600, marginTop: 4 }}>{j.verdict}</p>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  }

  // ── Profile view ──
  const color = heatColor(selectedJudge.anomaly_score);
  const bg = heatBg(selectedJudge.anomaly_score);
  const barData = profile
    ? Object.entries(profile.offense_breakdown || {}).map(([offense, stats]) => ({
        offense, judge: parseFloat(stats.avg_sentence?.toFixed(1) || 0), cases: stats.count || 0,
      }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 28, minHeight: '100vh', background: '#0C0C0C' }}>
      {/* Back */}
      <motion.button whileHover={{ x: -4 }} onClick={() => { setSelectedJudge(null); setProfile(null); }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '8px 16px', borderRadius: 10,
          background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border-gold)', color: 'var(--gold)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        <ChevronLeft size={15} /> Back to all judges
      </motion.button>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 20, borderRadius: 99, background: 'var(--grad-gold)' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>Judge Profile</p>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.6px' }}>{selectedJudge.name}</h1>
      </div>

      {/* Profile header card */}
      <motion.div className="card" style={{ padding: 24, marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
                <MapPin size={13} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <p style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Court</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Indian High Court</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Total Cases', value: selectedJudge.cases, sub: 'analyzed', accent: 'var(--gold)', bg: 'rgba(201,168,76,0.1)' },
                { label: 'Anomaly Score', value: `${Math.round(selectedJudge.anomaly_score)}/100`, sub: selectedJudge.verdict, accent: color, bg },
                { label: 'Mean Deviation', value: `${selectedJudge.mean_deviation > 0 ? '+' : ''}${selectedJudge.mean_deviation.toFixed(2)}`, sub: selectedJudge.mean_deviation > 0 ? 'Above expected' : 'Below expected', accent: selectedJudge.mean_deviation > 0 ? '#D44060' : '#4DB890', bg: selectedJudge.mean_deviation > 0 ? 'rgba(212,64,96,0.1)' : 'rgba(77,184,144,0.1)' },
              ].map((s, i) => (
                <motion.div key={s.label} style={{ borderRadius: 16, padding: '16px', position: 'relative', overflow: 'hidden', background: s.bg, border: `1px solid ${s.accent}25` }}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '16px 16px 0 0', background: s.accent }} />
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: s.accent }}>{s.label}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: 'var(--text-1)', marginTop: 4, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: s.accent, marginTop: 4, fontWeight: 600 }}>{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <AnomalyGauge score={Math.round(selectedJudge.anomaly_score)} size={190} />
            {selectedJudge.anomaly_score >= 70 && (
              <motion.div className="pill" style={{ background: 'rgba(212,64,96,0.15)', color: '#D44060', fontWeight: 700, fontSize: 11, border: '1px solid rgba(212,64,96,0.3)' }}
                animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                ⚠ High Deviation — Review Recommended
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      {profileLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}><div className="spinner" /></div>
      ) : profile && (
        <>
          {barData.length > 0 && (
            <motion.div className="card" style={{ padding: 20, marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
                  <TrendingUp size={13} style={{ color: 'var(--gold)' }} />
                </div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>Offense-wise Avg Sentence</h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barGap={3} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="offense" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} unit="y" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="judge" name="Avg Sentence (yrs)" fill="#C9A84C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {profile.recent_cases?.length > 0 && (
            <motion.div className="card" style={{ padding: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212,64,96,0.12)' }}>
                    <AlertCircle size={13} style={{ color: '#D44060' }} />
                  </div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>Recent Cases</h2>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{profile.recent_cases.length} records</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {['#', 'Offense', 'Actual Sentence', 'Predicted', 'Deviation'].map((h, i) => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-3)', borderRadius: i === 0 ? '12px 0 0 12px' : i === 4 ? '0 12px 12px 0' : 0 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profile.recent_cases.map((c, i) => {
                    const dev = parseFloat(c.category_deviation || 0);
                    const devColor = dev > 0.5 ? '#D44060' : dev < -0.5 ? '#4DB890' : 'var(--text-2)';
                    const devBg = dev > 0.5 ? 'rgba(212,64,96,0.12)' : dev < -0.5 ? 'rgba(77,184,144,0.12)' : 'rgba(255,255,255,0.05)';
                    return (
                      <motion.tr key={i} style={{ borderBottom: i < profile.recent_cases.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <td style={{ padding: '12px', fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{i + 1}</td>
                        <td style={{ padding: '12px' }}><span className="pill" style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', fontSize: 10 }}>{c.offense_type}</span></td>
                        <td style={{ padding: '12px', fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{c.sentence_years} yrs</td>
                        <td style={{ padding: '12px', fontSize: 12, color: 'var(--text-2)' }}>{c.predicted_category}</td>
                        <td style={{ padding: '12px' }}><span className="pill" style={{ background: devBg, color: devColor, fontWeight: 800, fontSize: 11 }}>{dev > 0 ? '+' : ''}{dev.toFixed(1)}</span></td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}