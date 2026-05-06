import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scale, Globe, User, FileText, BarChart3, Search, ArrowRight, Gavel, Shield, Brain, ChevronDown } from 'lucide-react';

const features = [
  { icon: Globe,     title: 'National Explorer',   desc: 'Real-time judicial analytics across all Indian High Courts with live anomaly tracking.',   path: '/explorer',          color: '#C9A84C', glow: 'rgba(201,168,76,0.3)' },
  { icon: User,      title: 'Judge Profiles',       desc: 'Deep ML-driven profiles of every judge — sentencing patterns, deviation scores, and bias signals.',  path: '/judges',            color: '#D44060', glow: 'rgba(212,64,96,0.3)'  },
  { icon: FileText,  title: 'Case Analysis',        desc: 'Paste any judgment and get instant SHAP-powered ML explanations and anomaly detection.', path: '/case-analysis',     color: '#4DB890', glow: 'rgba(77,184,144,0.3)'  },
  { icon: BarChart3, title: 'Bias Explorer',        desc: 'Uncover systemic disparities with heatmaps built from real SHAP importance values.',     path: '/bias-explorer',     color: '#A78BFA', glow: 'rgba(167,139,250,0.3)' },
  { icon: Search,    title: 'Similarity Search',    desc: 'Find historically similar precedents using TF-IDF semantic search across 852 judgments.', path: '/similarity-search', color: '#38BDF8', glow: 'rgba(56,189,248,0.3)'  },
];

const stats = [
  { value: '852', label: 'Judgments Indexed' },
  { value: '47+', label: 'Judges Profiled' },
  { value: '8',   label: 'High Courts' },
  { value: '99%', label: 'ML Accuracy' },
];

function Orb({ style }) {
  return <div className="orb" style={style} />;
}

function ScalesIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.line x1="40" y1="8" x2="40" y2="72" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      <motion.line x1="10" y1="22" x2="70" y2="22" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4 }} style={{ transformOrigin: '40px 22px' }} />
      <motion.circle cx="15" cy="38" r="10" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.1)"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} />
      <motion.circle cx="65" cy="38" r="10" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.1)"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} />
      <motion.line x1="40" y1="72" x2="25" y2="72" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 1.2 }} style={{ transformOrigin: '40px 72px' }} />
      <motion.line x1="40" y1="72" x2="55" y2="72" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 1.2 }} style={{ transformOrigin: '40px 72px' }} />
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  return (
    <div style={{ background: 'var(--bg-deep)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* ── Ambient cursor glow ── */}
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 0,
        left: mousePos.x - 200, top: mousePos.y - 200,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        transition: 'left 0.15s ease, top 0.15s ease',
      }} />

      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="hero-grid noise-overlay" style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <Orb style={{ width: 600, height: 600, top: -200, left: -200, background: 'radial-gradient(circle, rgba(139,26,45,0.18) 0%, transparent 70%)' }} />
        <Orb style={{ width: 500, height: 500, top: 100, right: -150, background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)' }} />
        <Orb style={{ width: 400, height: 400, bottom: -100, left: '40%', background: 'radial-gradient(circle, rgba(77,184,144,0.08) 0%, transparent 70%)' }} />

        {/* Scan line effect */}
        <motion.div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
          pointerEvents: 'none',
        }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 960 }}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99,
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', marginBottom: 32 }}>
            <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4DB890' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Live · Indian High Courts · ML-Powered
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }} className="float-anim">
              <ScalesIcon />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 900,
              lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-1)' }}>Verdict</span>
              <span className="gradient-text">Lens</span>
            </h1>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(16px, 2.5vw, 22px)',
              color: 'var(--silver-dim)', fontStyle: 'italic', marginBottom: 24, letterSpacing: '0.02em' }}>
              Judicial Intelligence Platform
            </p>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 640, margin: '0 auto 48px', fontWeight: 400 }}>
            Uncover systemic patterns in Indian judicial decisions using machine learning. 
            Detect sentencing anomalies, map judicial bias, and find legal precedents — in real time.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              className="btn-gold"
              onClick={() => navigate('/explorer')}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, borderRadius: 14 }}>
              <Globe size={18} /> Explore Platform
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              onClick={() => navigate('/case-analysis')}
              whileHover={{ scale: 1.04, borderColor: 'rgba(201,168,76,0.5)' }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px', fontSize: 15, fontWeight: 600,
                borderRadius: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-1)', cursor: 'pointer', transition: 'all 200ms' }}>
              <FileText size={18} /> Analyze a Judgment
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
            style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 + i * 0.1 }}
                style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, lineHeight: 1 }} className="gradient-text">{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={24} style={{ color: 'var(--gold)', opacity: 0.6 }} />
        </motion.div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section style={{ padding: '100px 32px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Platform Modules</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-1px' }}>
            Intelligence at Every Layer
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div key={f.path}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => navigate(f.path)}
              style={{ cursor: 'pointer', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden', transition: 'border-color 200ms' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.glow.replace('0.3', '0.5'); e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${f.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {/* Top gradient bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              {/* Background glow */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: `radial-gradient(circle, ${f.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${f.glow.replace('0.3', '0.15')}`, border: `1px solid ${f.glow}` }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.3px' }}>{f.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>{f.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color: f.color, fontSize: 12, fontWeight: 600 }}>
                <span>Open module</span> <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ WHY ══════════════ */}
      <section style={{ padding: '80px 32px 120px', position: 'relative', borderTop: '1px solid var(--border-subtle)' }}>
        <Orb style={{ width: 400, height: 400, top: -100, right: 0, background: 'radial-gradient(circle, rgba(139,26,45,0.12) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Why VerdictLens</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, color: 'var(--text-1)', lineHeight: 1.2, letterSpacing: '-1px', marginBottom: 20 }}>
              Justice Should Be <span className="gradient-text">Transparent</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 32 }}>
              Our ML models analyzed 852 real Indian High Court judgments and found that judge identity is the 3rd most important factor in sentence severity — above bail status and defendant age.
            </p>
            {[
              { icon: Brain,  text: 'XGBoost ML trained on real High Court data' },
              { icon: Shield, text: 'SHAP-powered explainable AI decisions' },
              { icon: Gavel,  text: '8× sentencing difference detected across judges' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.12)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={16} style={{ color: 'var(--gold)' }} />
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--grad-gold)' }} />
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: 20 }}>Key Finding</p>
            {[
              { label: 'Judge Identity',   value: 0.17, rank: '#3 Factor' },
              { label: 'Is Murder',        value: 0.55, rank: '#1 Factor' },
              { label: 'IPC Sections',     value: 0.32, rank: '#2 Factor' },
              { label: 'Bail Status',      value: 0.07, rank: '#6 Factor' },
              { label: 'Defendant Age',    value: 0.08, rank: '#5 Factor' },
            ].map((item, i) => (
              <div key={item.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{item.rank}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${(item.value / 0.55) * 100}%` }} viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 99, background: item.label === 'Judge Identity' ? 'var(--grad-crimson)' : 'var(--grad-gold)' }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 16 }}>SHAP importance values from trained XGBoost model</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{ padding: '80px 32px 120px', textAlign: 'center', position: 'relative' }}>
        <Orb style={{ width: 600, height: 600, top: -150, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', width: 80, height: 80, borderRadius: 24, background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border-gold)', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <Scale size={36} style={{ color: 'var(--gold)' }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-1.5px', marginBottom: 16 }}>
            Ready to Illuminate Justice?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Enter the platform and start exploring judicial analytics backed by real data and ML intelligence.
          </p>
          <motion.button className="btn-gold" onClick={() => navigate('/explorer')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            style={{ padding: '16px 40px', fontSize: 16, fontWeight: 700, borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <Globe size={20} /> Enter Platform <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scale size={18} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>VerdictLens</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Judicial Intelligence · Beta v0.9.2 · Apr 2024 dataset</span>
      </div>
    </div>
  );
}
