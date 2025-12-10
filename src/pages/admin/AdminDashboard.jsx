// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supaBaseConfig';
import StatCard from '../../components/admin/StatCard';

const AdminDashboard = () => {
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      
      // Obtener el total de productos
      const { count: countProductos, error: errorProductos } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true });

      if (errorProductos) throw errorProductos;

      // Obtener el total de pedidos (excluyendo administradores)
      const { count: countPedidos, error: errorPedidos } = await supabase
        .from('pedidos')
        .select('*, perfiles!inner(rol)', { count: 'exact', head: true })
        .neq('perfiles.rol', 'admin');

      if (errorPedidos) throw errorPedidos;

      // Obtener el total de clientes (excluyendo administradores)
      const { count: countClientes, error: errorClientes } = await supabase
        .from('perfiles')
        .select('*', { count: 'exact', head: true })
        .neq('rol', 'admin');

      if (errorClientes) throw errorClientes;

      // Obtener top 3 productos con más stock
      const { data: productos, error: errorTop } = await supabase
        .from('productos')
        .select('nombre, stock')
        .order('stock', { ascending: false })
        .limit(3);

      if (errorTop) throw errorTop;

      setTotalProductos(countProductos || 0);
      setTotalPedidos(countPedidos || 0);
      setTotalClientes(countClientes || 0);
      setTopProductos(productos || []);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

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
              value={loading ? "..." : totalProductos.toString()} 
              icon="📦" 
              colorClass="bg-warning" // Amarillo
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
              title="Total de Pedidos" 
              value={loading ? "..." : totalPedidos.toString()} 
              icon="💰" 
              colorClass="bg-success" // Verde
            />
          </div>
          
          
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard 
              title="Total de Clientes Registrados" 
              value={loading ? "..." : totalClientes.toString()} 
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
                 <p className="text-center text-muted pt-5">Área del Gráfico (PROXIMAMENTE)</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha Pequeña (4/12) */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="card-title mb-0">Top Productos con Mayor Stock</h5>
              </div>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : topProductos.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {topProductos.map((producto, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0 mx-3">
                      {producto.nombre}
                      <span className="badge bg-primary rounded-pill">{producto.stock} un.</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>No hay productos disponibles</p>
                </div>
              )}
            </div>
          </div>

        </div> {/* Fin row */}
        
      </div>
  );
};

export default AdminDashboard;