// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import StatCard from '../../components/admin/StatCard';

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Dashboard General</h1>
        </div>

        {/* 1. SECCIÓN DE TARJETAS (KPIs) */}
        {/* g-4 da espaciado (gap) entre tarjetas */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
              title="Total de Productos" 
              value="12" 
              icon="📦" 
              colorClass="bg-warning" // Amarillo
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
              title="Total de Pedidos" 
              value="5" 
              icon="💰" 
              colorClass="bg-success" // Verde
            />
          </div>
          
          
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
              title="Total de Clientes Registrados" 
              value="10" 
              icon="👤" 
              colorClass="bg-primary" // Azul
            />
          </div>
        </div>

        {/* 2. SECCIÓN MIXTA (Gráfico y Top Productos) */}
        <div className="row g-4">
          
          {/* Columna Izquierda Grande (8/12) */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0">Tendencia de Ventas</h5>
              </div>
              <div className="card-body bg-light" style={{ height: '300px' }}>
                 {/* Aquí integrarías tu librería de gráficos luego */}
                 <p className="text-center text-muted pt-5">Área del Gráfico (Recharts / Chart.js)</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha Pequeña (4/12) */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0">Top Productos</h5>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 mx-3">
                  Extractor 100mm
                  <span className="badge bg-primary rounded-pill">24 un.</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 mx-3">
                  Aire Acond. Split
                  <span className="badge bg-primary rounded-pill">15 un.</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 mx-3">
                  Rejilla Ventilación
                  <span className="badge bg-primary rounded-pill">10 un.</span>
                </li>
              </ul>
            </div>
          </div>

        </div> {/* Fin row */}
        
      </div>
  );
};

export default AdminDashboard;