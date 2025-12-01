import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import { inicializarPedidosEjemplo } from "../utils/inicializarDatosPrueba";

export default function MisPedidos() {
  const { pedidos, filtrarPorEstado, obtenerPedido } = usePedidos();
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const pedidosFiltrados = filtrarPorEstado(filtroEstado);

  const inicializarDatosPrueba = () => {
    inicializarPedidosEjemplo();
    window.location.reload();
  };

  const obtenerEstadoColor = (estado) => {
    const colores = {
      'en proceso': 'warning',
      'enviado': 'info',
      'entregado': 'success',
      'cancelado': 'danger'
    };
    return colores[estado] || 'secondary';
  };

  const obtenerEstadoIcono = (estado) => {
    const iconos = {
      'en proceso': 'bi-clock-history',
      'enviado': 'bi-truck',
      'entregado': 'bi-check-circle-fill',
      'cancelado': 'bi-x-circle-fill'
    };
    return iconos[estado] || 'bi-question-circle';
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    return `S/ ${precio.toFixed(2)}`;
  };

  const verDetalles = (pedidoId) => {
    const pedido = obtenerPedido(pedidoId);
    setPedidoSeleccionado(pedido);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPedidoSeleccionado(null);
  };

  const contarPorEstado = (estado) => {
    return pedidos.filter(p => p.estado === estado).length;
  };

  return (
    <div className="mis-pedidos-page">
      <div className="container-xl py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0">Mis Pedidos</h1>
          
          {/* Botón para inicializar datos de prueba (solo visible si no hay pedidos) */}
          {pedidos.length === 0 && (
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={inicializarDatosPrueba}
              title="Crear pedidos de ejemplo para pruebas"
            >
              <i className="bi bi-database-add me-2"></i>
              Cargar pedidos de ejemplo
            </button>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <i className="bi bi-bag-check-fill text-primary fs-1"></i>
                <h3 className="fw-bold mt-2">{pedidos.length}</h3>
                <p className="text-muted mb-0">Total Pedidos</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <i className="bi bi-clock-history text-warning fs-1"></i>
                <h3 className="fw-bold mt-2">{contarPorEstado('en proceso')}</h3>
                <p className="text-muted mb-0">En Proceso</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <i className="bi bi-truck text-info fs-1"></i>
                <h3 className="fw-bold mt-2">{contarPorEstado('enviado')}</h3>
                <p className="text-muted mb-0">Enviados</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <i className="bi bi-check-circle-fill text-success fs-1"></i>
                <h3 className="fw-bold mt-2">{contarPorEstado('entregado')}</h3>
                <p className="text-muted mb-0">Entregados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Filtrar por estado:</h5>
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                name="filtroEstado"
                id="todos"
                checked={filtroEstado === 'todos'}
                onChange={() => setFiltroEstado('todos')}
              />
              <label className="btn btn-outline-primary" htmlFor="todos">
                <i className="bi bi-list-ul me-2"></i>
                Todos ({pedidos.length})
              </label>

              <input
                type="radio"
                className="btn-check"
                name="filtroEstado"
                id="enProceso"
                checked={filtroEstado === 'en proceso'}
                onChange={() => setFiltroEstado('en proceso')}
              />
              <label className="btn btn-outline-warning" htmlFor="enProceso">
                <i className="bi bi-clock-history me-2"></i>
                En Proceso ({contarPorEstado('en proceso')})
              </label>

              <input
                type="radio"
                className="btn-check"
                name="filtroEstado"
                id="enviado"
                checked={filtroEstado === 'enviado'}
                onChange={() => setFiltroEstado('enviado')}
              />
              <label className="btn btn-outline-info" htmlFor="enviado">
                <i className="bi bi-truck me-2"></i>
                Enviado ({contarPorEstado('enviado')})
              </label>

              <input
                type="radio"
                className="btn-check"
                name="filtroEstado"
                id="entregado"
                checked={filtroEstado === 'entregado'}
                onChange={() => setFiltroEstado('entregado')}
              />
              <label className="btn btn-outline-success" htmlFor="entregado">
                <i className="bi bi-check-circle me-2"></i>
                Entregado ({contarPorEstado('entregado')})
              </label>

              <input
                type="radio"
                className="btn-check"
                name="filtroEstado"
                id="cancelado"
                checked={filtroEstado === 'cancelado'}
                onChange={() => setFiltroEstado('cancelado')}
              />
              <label className="btn btn-outline-danger" htmlFor="cancelado">
                <i className="bi bi-x-circle me-2"></i>
                Cancelado ({contarPorEstado('cancelado')})
              </label>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="row g-4">
          {pedidosFiltrados.length === 0 ? (
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 text-muted">No hay pedidos para mostrar</h4>
                  <p className="text-muted">
                    {filtroEstado === 'todos' 
                      ? 'Aún no has realizado ningún pedido'
                      : `No tienes pedidos con estado "${filtroEstado}"`
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <div key={pedido.id} className="col-12">
                <div className="card shadow-sm hover-shadow">
                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* Información del pedido */}
                      <div className="col-md-3">
                        <h5 className="fw-bold mb-2">
                          <i className="bi bi-receipt me-2"></i>
                          {pedido.id}
                        </h5>
                        <p className="text-muted mb-1">
                          <i className="bi bi-calendar3 me-2"></i>
                          {formatearFecha(pedido.fecha)}
                        </p>
                        <span className={`badge bg-${obtenerEstadoColor(pedido.estado)} mt-2`}>
                          <i className={`bi ${obtenerEstadoIcono(pedido.estado)} me-1`}></i>
                          {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                        </span>
                      </div>

                      {/* Productos */}
                      <div className="col-md-5">
                        <h6 className="fw-semibold mb-2">Productos:</h6>
                        <ul className="list-unstyled mb-0">
                          {pedido.productos.map((producto, index) => (
                            <li key={index} className="mb-1">
                              <i className="bi bi-box-seam me-2 text-primary"></i>
                              {producto.nombre} 
                              <span className="text-muted"> x{producto.cantidad}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Total y acciones */}
                      <div className="col-md-4 text-md-end">
                        <h4 className="fw-bold text-primary mb-3">
                          {formatearPrecio(pedido.total)}
                        </h4>
                        <button 
                          className="btn btn-custom w-100"
                          onClick={() => verDetalles(pedido.id)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {mostrarModal && pedidoSeleccionado && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={cerrarModal}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-receipt me-2"></i>
                  Detalle del Pedido {pedidoSeleccionado.id}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={cerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Estado */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Estado del Pedido</h6>
                  <span className={`badge bg-${obtenerEstadoColor(pedidoSeleccionado.estado)} fs-6 px-3 py-2`}>
                    <i className={`bi ${obtenerEstadoIcono(pedidoSeleccionado.estado)} me-2`}></i>
                    {pedidoSeleccionado.estado.charAt(0).toUpperCase() + pedidoSeleccionado.estado.slice(1)}
                  </span>
                  {pedidoSeleccionado.estado === 'cancelado' && (
                    <div className="alert alert-danger mt-3">
                      <strong>Motivo de cancelación:</strong> {pedidoSeleccionado.motivoCancelacion}
                    </div>
                  )}
                </div>

                {/* Fechas */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Información de Fechas</h6>
                  <p className="mb-1">
                    <strong>Fecha de pedido:</strong> {formatearFecha(pedidoSeleccionado.fecha)}
                  </p>
                  {pedidoSeleccionado.fechaEntrega && (
                    <p className="mb-1">
                      <strong>Fecha de entrega:</strong> {formatearFecha(pedidoSeleccionado.fechaEntrega)}
                    </p>
                  )}
                  {pedidoSeleccionado.fechaEstimadaEntrega && pedidoSeleccionado.estado !== 'entregado' && (
                    <p className="mb-1">
                      <strong>Fecha estimada de entrega:</strong> {formatearFecha(pedidoSeleccionado.fechaEstimadaEntrega)}
                    </p>
                  )}
                </div>

                {/* Productos */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Productos</h6>
                  {pedidoSeleccionado.productos.map((producto, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <h6 className="mb-1">{producto.nombre}</h6>
                            <p className="text-muted mb-0">Cantidad: {producto.cantidad}</p>
                          </div>
                          <div className="col-4 text-end">
                            <p className="fw-bold mb-0">{formatearPrecio(producto.precio)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dirección de envío */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Dirección de Envío</h6>
                  <p className="mb-0">
                    {pedidoSeleccionado.direccionEnvio.calle} {pedidoSeleccionado.direccionEnvio.numero}<br />
                    {pedidoSeleccionado.direccionEnvio.distrito}, {pedidoSeleccionado.direccionEnvio.ciudad}<br />
                    {pedidoSeleccionado.direccionEnvio.departamento}
                  </p>
                </div>

                {/* Método de pago */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Método de Pago</h6>
                  <p className="mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    {pedidoSeleccionado.metodoPago}
                  </p>
                </div>

                {/* Total */}
                <div className="border-top pt-3">
                  <div className="row">
                    <div className="col-6">
                      <h5 className="fw-bold">Total:</h5>
                    </div>
                    <div className="col-6 text-end">
                      <h5 className="fw-bold text-primary">{formatearPrecio(pedidoSeleccionado.total)}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
