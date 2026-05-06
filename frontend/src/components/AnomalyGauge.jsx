import React from 'react';

/**
 * Dark theme SVG arc gauge.
 * score >= 70 → crimson  |  >= 40 → amber/gold  |  < 40 → emerald
 */
export default function AnomalyGauge({ score = 0, size = 160 }) {
  const radius = (size - 24) / 2;
  const circumference = Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const dashOffset = circumference - (progress / 100) * circumference;

  let color = '#4DB890';
  let glowColor = 'rgba(77,184,144,0.4)';
  let gradId = 'gaugeGreenGrad';
  if (score >= 70) { color = '#D44060'; glowColor = 'rgba(212,64,96,0.4)'; gradId = 'gaugeCrimsonGrad'; }
  else if (score >= 40) { color = '#C9A84C'; glowColor = 'rgba(201,168,76,0.4)'; gradId = 'gaugeGoldGrad'; }

  const cx = size / 2;
  const cy = size / 2 + 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <defs>
          <linearGradient id="gaugeGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1B6B52" /><stop offset="100%" stopColor="#4DB890" />
          </linearGradient>
          <linearGradient id="gaugeGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#856718" /><stop offset="100%" stopColor="#E8C76C" />
          </linearGradient>
          <linearGradient id="gaugeCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B1A2D" /><stop offset="100%" stopColor="#D44060" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Background glow disc */}
        <circle cx={cx} cy={cy} r={radius + 14} fill={glowColor.replace('0.4', '0.06')} />
        {/* Track */}
        <path d={describeArc(cx, cy, radius, 180, 360)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} strokeLinecap="round" />
        {/* Progress arc */}
        <path d={describeArc(cx, cy, radius, 180, 360)} fill="none" stroke={`url(#${gradId})`} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${circumference}`} strokeDashoffset={`${dashOffset}`}
          filter="url(#gaugeGlow)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)' }} />
        {/* Score text */}
        <text x={cx} y={cy - 2} textAnchor="middle" fill="#F0F0FA" fontSize={size * 0.22} fontWeight="900" fontFamily="'Playfair Display', serif">{score}</text>
        <text x={cx} y={cy + size * 0.13} textAnchor="middle" fill="#6A6E84" fontSize={size * 0.085} fontFamily="Inter, sans-serif" fontWeight="500">/ 100</text>
      </svg>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)' }}>Anomaly Score</p>
    </div>
  );
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}
