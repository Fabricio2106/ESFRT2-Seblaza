// src/components/admin/StatCard.jsx
import React from 'react';

// Props:
// title: Título pequeño (ej. "Ventas")
// value: El número grande (ej. "$1,200")
// icon: Un emoji o componente de ícono
// colorClass: Clase de color de fondo de Bootstrap (ej. "bg-primary", "bg-success")

const StatCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        {/* Círculo del ícono */}
        <div className={`rounded-circle p-3 text-white me-3 ${colorClass} d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
          {icon}
        </div>
        
        {/* Texto */}
        <div>
          <h6 className="card-subtitle text-muted mb-1 text-uppercase small">{title}</h6>
          <h3 className="card-title mb-0 fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;