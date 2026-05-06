import React from 'react';

export default function Card({ children, className = '', style = {}, hover = true }) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
