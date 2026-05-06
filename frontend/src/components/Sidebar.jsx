import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, User, FileText, BarChart3, Search, Scale, LogOut } from 'lucide-react';

const navItems = [
  { to: '/explorer',          label: 'Explorer',          icon: Globe,     desc: 'National overview',   color: '#C9A84C' },
  { to: '/judges',            label: 'Judges',            icon: User,      desc: 'Judge profiles',      color: '#D44060' },
  { to: '/case-analysis',     label: 'Case Analysis',     icon: FileText,  desc: 'Document analysis',   color: '#4DB890' },
  { to: '/bias-explorer',     label: 'Bias Explorer',     icon: BarChart3, desc: 'Disparity heatmaps',  color: '#D4783A' },
  { to: '/similarity-search', label: 'Similarity Search', icon: Search,    desc: 'Find precedents',     color: '#E8607A' },
];

const listV = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const itemV = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } } };

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, height: '100%', width: 256, zIndex: 20,
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #141414 0%, #0C0C0C 100%)',
      borderRight: '1px solid rgba(201,168,76,0.14)',
    }}>
      {/* Top glow line */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ padding: '24px 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: '0 0 20px rgba(201,168,76,0.15)' }}>
          <Scale size={18} style={{ color: '#C9A84C' }} />
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", color: '#F0F0FA', fontWeight: 900, fontSize: 17, letterSpacing: '-0.3px' }}>VerdictLens</div>
          <div style={{ color: 'var(--text-3)', fontSize: 10, marginTop: 1, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Judicial Intelligence</div>
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{ margin: '0 20px 16px', height: 1, background: 'rgba(255,255,255,0.05)' }} />

      {/* Section label */}
      <p style={{ padding: '0 20px', marginBottom: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--text-4)' }}>Navigation</p>

      {/* Nav */}
      <motion.nav variants={listV} initial="hidden" animate="show" style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, label, icon: Icon, desc, color }) => (
          <motion.div key={to} variants={itemV}>
            <NavLink to={to} end={to === '/explorer'} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <motion.div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                    borderRadius: 12, cursor: 'pointer', position: 'relative',
                    background: isActive ? `rgba(${color === '#C9A84C' ? '201,168,76' : color === '#D44060' ? '212,64,96' : color === '#4DB890' ? '77,184,144' : color === '#D4783A' ? '212,120,58' : '232,96,122'},0.1)` : 'transparent',
                    border: isActive ? `1px solid ${color}30` : '1px solid transparent',
                    boxShadow: isActive ? `0 0 20px ${color}15` : 'none',
                  }}
                  whileHover={!isActive ? { x: 4, backgroundColor: 'rgba(255,255,255,0.04)' } : {}}
                  transition={{ duration: 0.15 }}
                >
                  {/* Active glow */}
                  {isActive && <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: 99, background: color }} />}

                  {/* Icon */}
                  <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: isActive ? `${color}20` : 'rgba(255,255,255,0.05)' }}>
                    <Icon size={14} style={{ color: isActive ? color : 'var(--text-3)' }} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#F0F0FA' : 'var(--text-2)', letterSpacing: '-0.1px' }}>{label}</div>
                    <div style={{ fontSize: 10, color: isActive ? color : 'var(--text-3)', marginTop: 1 }}>{desc}</div>
                  </div>
                </motion.div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      {/* Footer */}
      <div style={{ padding: '12px 12px 20px' }}>
        <motion.button onClick={() => navigate('/')} whileHover={{ x: 2 }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer', color: 'var(--text-3)', fontSize: 12, fontWeight: 500 }}>
          <LogOut size={14} />
          Back to Home
        </motion.button>

        <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <motion.div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4DB890', position: 'relative' }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span style={{ color: '#4DB890', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
            <span style={{ color: 'var(--text-3)', fontSize: 10 }}>· Apr 2024 dataset</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-4)', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Beta v0.9.2</span>
            <span style={{ color: 'var(--text-4)', fontSize: 9 }}>47,382 cases</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
