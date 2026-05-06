import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, Scale, BookOpen, ArrowUp, Search, Sparkles } from 'lucide-react';
import Card from '../components/GlassCard.jsx';
import { analyzeJudgment } from '../api/verdictlens.js';

const SAMPLE_TEXT = `IN THE HIGH COURT OF JUDICATURE AT BOMBAY
CORAM: B.H.MARLAPALLE, J.
Criminal Appeal No. 748 of 2001
State of Maharashtra vs Farooq Mirza

The accused Farooq Mirza was convicted under Section 392 IPC for robbery. The trial court sentenced the accused to undergo rigorous imprisonment for 4 years and pay fine of Rs 5000. Bail application was rejected by the lower court.`;

export default function CaseAnalysis() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    if (!text.trim() || text.length < 100) { setError('Please paste a judgment text of at least 100 characters.'); return; }
    setLoading(true); setError(null);
    try { const data = await analyzeJudgment(text); setResult(data); }
    catch { setError('Analysis failed. Make sure the backend is running.'); }
    finally { setLoading(false); }
  }

  const maxShap = result ? Math.max(...result.shap_explanation.map(f => Math.abs(f.shap_value))) : 1;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      style={{ padding: 28, minHeight: '100vh', background: '#0C0C0C' }}>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 20, borderRadius: 99, background: 'var(--grad-gold)' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>Case Analysis</p>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.8px' }}>Judgment Analyzer</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>Paste any Indian court judgment to get ML-powered analysis</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* LEFT — input */}
        <Card className="p-5" style={{ display: 'flex', flexDirection: 'column', maxHeight: '82vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
              <FileText size={13} style={{ color: 'var(--gold)' }} />
            </div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Judgment Text</h2>
            <button onClick={() => setText(SAMPLE_TEXT)} className="pill"
              style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)', cursor: 'pointer', border: '1px solid var(--border-subtle)', fontSize: 10 }}>
              Load Sample
            </button>
          </div>

          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste full court judgment text here..."
            style={{ flex: 1, minHeight: 320, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 16,
              fontFamily: 'Georgia, serif', fontSize: 12, color: 'var(--text-1)', lineHeight: 1.85, resize: 'none', outline: 'none', transition: 'border-color 200ms' }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />

          {error && <p style={{ fontSize: 12, color: '#D44060', marginTop: 10 }}>{error}</p>}

          <motion.button onClick={handleAnalyze} disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, padding: '12px 20px', fontSize: 13, fontWeight: 700,
              opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'rgba(0,0,0,0.7)', animation: 'spin 0.9s linear infinite' }} /> Analyzing...</>
              : <><Search size={15} /> Analyze Judgment</>}
          </motion.button>
        </Card>

        {/* RIGHT — results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', maxHeight: '82vh' }}>

          {!result && !loading && (
            <Card style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border-gold)', marginBottom: 16 }}>
                <Cpu size={28} style={{ color: 'var(--gold)' }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.7, maxWidth: 320 }}>
                Paste a judgment and click Analyze to see ML predictions, SHAP explanations, and anomaly detection.
              </p>
            </Card>
          )}

          {loading && (
            <Card style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
              <div className="spinner" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Running ML analysis...</p>
            </Card>
          )}

          {result && (
            <>
              {/* AI Summary */}
              <Card className="p-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(77,184,144,0.12)' }}>
                    <Sparkles size={13} style={{ color: '#4DB890' }} />
                  </div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Analysis Summary</h2>
                  <span className="pill" style={{ marginLeft: 'auto', background: 'rgba(77,184,144,0.12)', color: '#4DB890', border: '1px solid rgba(77,184,144,0.25)' }}>ML Powered</span>
                </div>
                <div style={{ borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.8 }}>{result.summary}</p>
                </div>
              </Card>

              {/* Extracted Fields */}
              <Card className="p-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
                    <BookOpen size={13} style={{ color: 'var(--gold)' }} />
                  </div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Extracted Fields</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Judge',              value: result.judge_name },
                    { label: 'Offense Type',       value: result.offense_type },
                    { label: 'IPC Sections',       value: result.ipc_sections.join(', ') || 'Not found' },
                    { label: 'Predicted Category', value: result.predicted_category },
                    { label: 'Confidence',         value: `${(result.confidence * 100).toFixed(0)}%` },
                    { label: 'Anomaly Score',      value: `${result.anomaly_score.toFixed(0)}/100` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ borderRadius: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-3)', marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Deviation flag */}
              {result.deviation_flag && (
                <Card className="p-4">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212,64,96,0.15)' }}>
                      <ArrowUp size={13} style={{ color: '#D44060' }} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#D44060' }}>Deviation Detected — actual sentence differs from predicted category</p>
                  </div>
                </Card>
              )}

              {/* SHAP */}
              <Card className="p-5">
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>SHAP Feature Attribution</h2>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Which factors most influenced this prediction</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.shap_explanation.slice(0, 8).map(f => {
                    const pct = (Math.abs(f.shap_value) / maxShap) * 100;
                    const isPos = f.direction === 'increases';
                    return (
                      <div key={f.feature} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, width: 130, textAlign: 'right', flexShrink: 0, color: 'var(--text-2)', fontWeight: 500 }}>
                          {f.feature.replace(/_/g, ' ')}
                        </span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: 20, position: 'relative' }}>
                          <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
                            {!isPos && <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }}
                              style={{ height: 14, background: 'linear-gradient(to left, #4DB890, rgba(77,184,144,0.4))', borderRadius: '4px 0 0 4px', boxShadow: '0 0 8px rgba(77,184,144,0.4)' }} />}
                          </div>
                          <div style={{ width: 1, height: 18, background: 'var(--border-medium)', flexShrink: 0 }} />
                          <div style={{ width: '50%' }}>
                            {isPos && <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }}
                              style={{ height: 14, background: 'linear-gradient(to right, #D44060, rgba(212,64,96,0.4))', borderRadius: '0 4px 4px 0', boxShadow: '0 0 8px rgba(212,64,96,0.4)' }} />}
                          </div>
                        </div>
                        <span style={{ fontSize: 11, width: 48, textAlign: 'right', flexShrink: 0, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: isPos ? '#D44060' : '#4DB890' }}>
                          {isPos ? '+' : ''}{f.shap_value.toFixed(3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                  {[['#D44060', 'Increases sentence'], ['#4DB890', 'Decreases sentence']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-3)' }}>
                      <div style={{ width: 12, height: 8, borderRadius: 3, background: c, boxShadow: `0 0 6px ${c}80` }} />
                      {l}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}