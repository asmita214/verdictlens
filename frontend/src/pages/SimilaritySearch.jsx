import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers } from 'lucide-react';
import Card from '../components/GlassCard.jsx';
import { searchSimilarCases } from '../api/verdictlens.js';

const offenseMeta = {
  robbery:    { bg: 'rgba(201,168,76,0.12)',  color: '#C9A84C' },
  murder:     { bg: 'rgba(212,64,96,0.12)',   color: '#D44060' },
  fraud:      { bg: 'rgba(212,120,58,0.12)',  color: '#D4783A' },
  assault:    { bg: 'rgba(212,64,96,0.12)',   color: '#D44060' },
  theft:      { bg: 'rgba(201,168,76,0.12)',  color: '#C9A84C' },
  rape:       { bg: 'rgba(212,64,96,0.12)',   color: '#D44060' },
  kidnapping: { bg: 'rgba(212,120,58,0.12)',  color: '#D4783A' },
  drug:       { bg: 'rgba(232,96,122,0.12)',  color: '#E8607A' },
  unknown:    { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-2)' },
};

function scoreStyle(score) {
  if (score >= 0.85) return { bg: 'rgba(77,184,144,0.15)',  color: '#4DB890', border: '1px solid rgba(77,184,144,0.3)'  };
  if (score >= 0.70) return { bg: 'rgba(201,168,76,0.15)',  color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)'  };
  return                     { bg: 'rgba(212,120,58,0.15)',  color: '#D4783A', border: '1px solid rgba(212,120,58,0.3)'  };
}

const PLACEHOLDER = `Describe the facts of your case. For example: robbery case where accused convicted under Section 392 IPC sentenced to imprisonment`;

export default function SimilaritySearch() {
  const [query, setQuery]       = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults]   = useState(null);
  const [error, setError]       = useState(null);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true); setResults(null); setError(null);
    try { const data = await searchSimilarCases(query, 5); setResults(data.results || []); }
    catch { setError('Search failed. Make sure the backend is running.'); }
    finally { setSearching(false); }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      style={{ padding: 28, minHeight: '100vh', background: '#0C0C0C' }}>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 3, height: 20, borderRadius: 99, background: 'var(--grad-gold)' }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>Precedent Search</p>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.8px' }}>Similarity Search</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>Find similar historical cases from 852 real Indian High Court judgments</p>
      </div>

      {/* Search box */}
      <Card className="p-6" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)' }}>
            <Search size={13} style={{ color: 'var(--gold)' }} />
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Paste Case Facts</h2>
        </div>
        <textarea value={query} onChange={e => setQuery(e.target.value)} placeholder={PLACEHOLDER} rows={4}
          style={{ width: '100%', borderRadius: 12, padding: '14px 16px', fontSize: 13, resize: 'none', outline: 'none',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-1)', lineHeight: 1.8, fontFamily: 'Georgia, serif', transition: 'border-color 200ms' }}
          onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--text-4)' }}>
            {query.length > 0 ? `${query.length} characters` : 'Describe offense type, IPC section, circumstances'}
          </p>
          <motion.button onClick={handleSearch} disabled={searching || !query.trim()}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', fontSize: 13, fontWeight: 700,
              opacity: query.trim() ? 1 : 0.4, cursor: query.trim() ? 'pointer' : 'not-allowed' }}>
            {searching ? (
              <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'rgba(0,0,0,0.7)', animation: 'spin 0.9s linear infinite' }} /> Searching...</>
            ) : (
              <><Search size={14} /> Find Similar Cases</>
            )}
          </motion.button>
        </div>
        {error && <p style={{ fontSize: 12, color: '#D44060', marginTop: 10 }}>{error}</p>}
      </Card>

      <AnimatePresence mode="wait">
        {!results && !searching && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border-gold)' }}>
              <Layers size={30} style={{ color: 'var(--gold)' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>Describe your case to begin</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)', maxWidth: 420, lineHeight: 1.7 }}>
                VerdictLens finds historically similar cases using TF-IDF similarity matching across real Indian court judgments
              </p>
            </div>
          </motion.div>
        )}

        {searching && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: 16 }}>
            <div className="spinner" />
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Searching real judgment database...</p>
          </motion.div>
        )}

        {results && !searching && (
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Results</h2>
              <span className="pill" style={{ background: 'rgba(77,184,144,0.12)', color: '#4DB890', border: '1px solid rgba(77,184,144,0.25)' }}>
                {results.length} cases found
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map((r, i) => {
                const ss = scoreStyle(r.similarity_score);
                const offense = (r.offense_type || 'unknown').toLowerCase();
                const om = offenseMeta[offense] || offenseMeta.unknown;
                const pct = Math.round(r.similarity_score * 100);

                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.22 }}>
                    <Card className="p-5" style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span className="pill" style={{ background: ss.bg, color: ss.color, border: ss.border, fontSize: 12, fontWeight: 800 }}>{pct}% Match</span>
                          <span className="pill" style={{ background: om.bg, color: om.color }}>{r.offense_type}</span>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 900, color: 'var(--text-1)' }}>{r.sentence_years} yrs</p>
                          <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.predicted_category}</p>
                        </div>
                      </div>

                      {/* Match bar */}
                      <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 12 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, delay: i * 0.07 }}
                          style={{ height: '100%', borderRadius: 99, background: ss.color, boxShadow: `0 0 8px ${ss.color}60` }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Judge: <strong style={{ color: 'var(--text-1)' }}>{r.judge_name}</strong></span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto' }}>Deviation: {r.deviation > 0 ? '+' : ''}{r.deviation.toFixed(2)}</span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}