// src/layouts/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Navbar2 from '../components/subcomponents/Navbar2';

const AdminLayout = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link link-dark';
  };

  return (
    <>
      {/* HEADER */}
      <Navbar2/>
      
      <div className="d-flex bg-light">
      {/* SIDEBAR */}
      {/* d-flex column, ancho fijo, fondo blanco y borde a la derecha */}
      <aside className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end" style={{ width: '280px', minHeight: 'calc(100vh - 120px)' }}>
        
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/admin/dashboard" className={isActive('/admin/dashboard')} aria-current="page">
              <i className="bi bi-house-door me-2"></i>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/admin/pedidos" className={isActive('/admin/pedidos')}>
              <i className="bi bi-cart me-2"></i>
              Pedidos
            </Link>
          </li>
          <li>
            <Link to="/admin/productos" className={isActive('/admin/productos')}>
              <i className="bi bi-box-seam me-2"></i>
              Productos
            </Link>
          </li>
          <li>
            <Link to="/admin/clientes" className={isActive('/admin/clientes')}>
              <i className="bi bi-people me-2"></i>
              Clientes
            </Link>
          </li>
          <li>
            <Link to="/admin/configuracion" className={isActive('/admin/configuracion')}>
              <i className="bi bi-gear me-2"></i>
              Configuracion
            </Link>
          </li>
        </ul>
       
        
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow-1 p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
    </>
  );
};

export default AdminLayout;