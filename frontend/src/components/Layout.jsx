import React from 'react';
import Sidebar from './Sidebar.jsx';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0C0C0C' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', marginLeft: 256, position: 'relative' }}>
        {/* Subtle grid bg */}
        <div className="grid-bg" style={{ position: 'fixed', inset: 0, marginLeft: 256, pointerEvents: 'none', zIndex: 0, opacity: 0.6 }} />
        <motion.div
          key="outlet"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
