import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const start = useRef(null);
  const frame = useRef(null);
  useEffect(() => {
    const numTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    start.current = null;
    const animate = (ts) => {
      if (!start.current) start.current = ts;
      const pct = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 4);
      setValue(Math.floor(eased * numTarget));
      if (pct < 1) frame.current = requestAnimationFrame(animate);
      else setValue(numTarget);
    };
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);
  return value;
}

export default function StatCard({ label, value, icon: Icon, accentColor = '#C9A84C', bgColor = 'rgba(201,168,76,0.1)', trend, trendUp = true, delay = 0 }) {
  const rawNum = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  const animated = useCountUp(rawNum, 1400);
  const suffix = String(value).replace(/[0-9,.]/g, '');
  const displayVal = isNaN(rawNum) ? value : (rawNum >= 1000 ? animated.toLocaleString() : animated) + suffix;

  return (
    <motion.div
      className="card card-hover"
      style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', overflow: 'hidden', cursor: 'default' }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {/* Accent top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      {/* Background radial glow */}
      <div style={{ position: 'absolute', bottom: -20, right: -20, width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${bgColor} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 4 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)' }}>{label}</p>
        {Icon && (
          <motion.div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: bgColor, border: `1px solid ${accentColor}30` }}
            whileHover={{ rotate: 12, scale: 1.1 }} transition={{ duration: 0.15 }}>
            <Icon size={15} style={{ color: accentColor }} />
          </motion.div>
        )}
      </div>

      <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-1.5px', lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
        {displayVal}
      </p>

      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <motion.span className="pill" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: delay + 0.8 }}
            style={{ background: trendUp ? 'rgba(77,184,144,0.15)' : 'rgba(212,64,96,0.15)',
              color: trendUp ? '#4DB890' : '#D44060', fontSize: 10, border: `1px solid ${trendUp ? 'rgba(77,184,144,0.3)' : 'rgba(212,64,96,0.3)'}` }}>
            {trendUp ? '↑' : '↓'} {trend}
          </motion.span>
        </div>
      )}
    </motion.div>
  );
}
