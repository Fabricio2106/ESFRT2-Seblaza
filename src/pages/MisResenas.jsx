import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePedidos } from "../hooks/usePedidos";
import Swal from "sweetalert2";
import extractorBano from "../assets/img/ExtractordeBaño.jpg";
import termoventilador from "../assets/img/Termoventilador.jpg";
import ventiladorTecho from "../assets/img/VentiladorTecho.jpg";
import bosch from "../assets/img/Bosch.jpg";

export default function MisResenas() {
  const { user } = useAuth();
  const { pedidos } = usePedidos();
  const [tabActiva, setTabActiva] = useState("pendientes");
  
  // Obtener productos de pedidos entregados para reseñas pendientes
  const [resenasPendientes, setResenasPendientes] = useState([]);
  const [resenasRealizadas, setResenasRealizadas] = useState([]);

  // Cargar reseñas realizadas desde localStorage
  useEffect(() => {
    const resenasGuardadas = localStorage.getItem("resenas");
    if (resenasGuardadas) {
      setResenasRealizadas(JSON.parse(resenasGuardadas));
    }
  }, []);

  useEffect(() => {
    console.log("Pedidos totales:", pedidos.length);
    console.log("Pedidos:", pedidos);
    
    // Mapeo de nombres de productos a imágenes locales
    const imagenesProductos = {
      "Extractor de aire": bosch,
      "Extractor de baño": extractorBano,
      "Termoventilador": termoventilador,
      "Ventilador de Techo LED": ventiladorTecho
    };
    
    // Filtrar pedidos con estado "entregado"
    const pedidosEntregados = pedidos.filter(pedido => pedido.estado === "entregado");
    console.log("Pedidos entregados:", pedidosEntregados.length);
    
    // Cargar reseñas realizadas
    const resenasGuardadas = JSON.parse(localStorage.getItem("resenas") || "[]");
    const productosConResena = resenasGuardadas.map(r => r.productoId);
    
    // Extraer todos los productos de esos pedidos que NO tienen reseña
    const productosParaReseña = [];
    pedidosEntregados.forEach(pedido => {
      pedido.productos.forEach(producto => {
        // Solo agregar si no tiene reseña
        if (!productosConResena.includes(producto.id)) {
          // Buscar imagen correspondiente
          let imagenProducto = "https://via.placeholder.com/80";
          
          // Buscar coincidencia en el mapeo de imágenes
          Object.keys(imagenesProductos).forEach(nombreClave => {
            if (producto.nombre.toLowerCase().includes(nombreClave.toLowerCase())) {
              imagenProducto = imagenesProductos[nombreClave];
            }
          });

          productosParaReseña.push({
            id: `${pedido.id}-${producto.id}`,
            productoId: producto.id,
            pedidoId: pedido.id,
            nombre: producto.nombre,
            imagen: producto.imagen || imagenProducto,
            fechaCompra: pedido.fecha,
            precio: producto.precio
          });
        }
      });
    });
    
    console.log("Productos para reseña:", productosParaReseña);
    setResenasPendientes(productosParaReseña);
  }, [pedidos]);

  // Estado para las calificaciones de cada producto (key: productoId, value: calificación)
  const [calificaciones, setCalificaciones] = useState({});
  const [hoverCalificaciones, setHoverCalificaciones] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [resenaEnEdicion, setResenaEnEdicion] = useState(null);

  const setCalificacion = (productoId, valor) => {
    setCalificaciones(prev => ({
      ...prev,
      [productoId]: valor
    }));
  };

  const setHoverCalificacion = (productoId, valor) => {
    setHoverCalificaciones(prev => ({
      ...prev,
      [productoId]: valor
    }));
  };

  const abrirModalComentario = (producto) => {
    setProductoSeleccionado(producto);
    setModoEdicion(false);
    setResenaEnEdicion(null);
    setMostrarModal(true);
  };

  const abrirModalEdicion = (resena) => {
    // Preparar datos para edición
    setProductoSeleccionado({
      id: resena.id,
      productoId: resena.productoId,
      pedidoId: resena.pedidoId,
      nombre: resena.nombre,
      imagen: resena.imagen,
      precio: resena.precio
    });
    
    // Cargar calificación y comentario existentes
    setCalificaciones(prev => ({
      ...prev,
      [resena.productoId]: resena.calificacion
    }));
    
    setComentarios(prev => ({
      ...prev,
      [resena.productoId]: resena.comentario || ""
    }));
    
    setModoEdicion(true);
    setResenaEnEdicion(resena);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    setModoEdicion(false);
    setResenaEnEdicion(null);
  };

  const guardarResena = () => {
    if (!productoSeleccionado) return;
    
    const calificacion = calificaciones[productoSeleccionado.productoId] || 0;
    const comentario = comentarios[productoSeleccionado.productoId] || "";
    
    if (calificacion === 0) {
      Swal.fire({
        icon: "warning",
        title: "Calificación requerida",
        text: "Por favor, selecciona una calificación",
      });
      return;
    }

    if (comentario.length > 0 && (comentario.length < 10 || comentario.length > 500)) {
      Swal.fire({
        icon: "warning",
        title: "Comentario inválido",
        text: "El comentario debe tener entre 10 y 500 caracteres",
      });
      return;
    }

    const resenasActuales = JSON.parse(localStorage.getItem("resenas") || "[]");

    if (modoEdicion && resenaEnEdicion) {
      // Modo edición: actualizar reseña existente
      const indice = resenasActuales.findIndex(r => r.id === resenaEnEdicion.id);
      if (indice !== -1) {
        resenasActuales[indice] = {
          ...resenasActuales[indice],
          calificacion: calificacion,
          comentario: comentario,
          fechaEdicion: new Date().toISOString()
        };
        
        localStorage.setItem("resenas", JSON.stringify(resenasActuales));
        setResenasRealizadas(resenasActuales);
        
        Swal.fire({
          icon: "success",
          title: "¡Reseña actualizada!",
          text: "Tu reseña se ha actualizado exitosamente",
          confirmButtonText: "Aceptar"
        });
      }
    } else {
      // Modo creación: crear nueva reseña
      const nuevaResena = {
        id: `RES-${Date.now()}`,
        productoId: productoSeleccionado.productoId,
        pedidoId: productoSeleccionado.pedidoId,
        nombre: productoSeleccionado.nombre,
        imagen: productoSeleccionado.imagen,
        calificacion: calificacion,
        comentario: comentario,
        fechaResena: new Date().toISOString(),
        precio: productoSeleccionado.precio
      };

      resenasActuales.push(nuevaResena);
      localStorage.setItem("resenas", JSON.stringify(resenasActuales));
      setResenasRealizadas(resenasActuales);
      
      // Eliminar de pendientes
      setResenasPendientes(prev => prev.filter(p => p.productoId !== productoSeleccionado.productoId));

      Swal.fire({
        icon: "success",
        title: "¡Reseña guardada!",
        text: "Tu opinión se ha publicado exitosamente",
        confirmButtonText: "Aceptar"
      });
      
      // Cambiar a la pestaña de realizadas
      setTabActiva("realizadas");
    }

    cerrarModal();
  };

  const eliminarResena = (resena) => {
    Swal.fire({
      title: '¿Eliminar opinión?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const resenasActuales = JSON.parse(localStorage.getItem("resenas") || "[]");
        const resenasActualizadas = resenasActuales.filter(r => r.id !== resena.id);
        
        localStorage.setItem("resenas", JSON.stringify(resenasActualizadas));
        setResenasRealizadas(resenasActualizadas);
        
        // Agregar nuevamente a pendientes
        const nuevoPendiente = {
          id: `${resena.pedidoId}-${resena.productoId}`,
          productoId: resena.productoId,
          pedidoId: resena.pedidoId,
          nombre: resena.nombre,
          imagen: resena.imagen,
          fechaCompra: new Date().toISOString(),
          precio: resena.precio
        };
        setResenasPendientes(prev => [...prev, nuevoPendiente]);
        
        Swal.fire({
          icon: 'success',
          title: '¡Eliminada!',
          text: 'Tu opinión ha sido eliminada',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const productosMostrar = tabActiva === "pendientes" ? resenasPendientes : resenasRealizadas;

  return (
    <div className="container-xl py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/mi-perfil" className="text-decoration-none">Mi Perfil</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Opiniones
          </li>
        </ol>
      </nav>

      {/* Título */}
      <div className="mb-4">
        <h1 className="fw-bold mb-0">
          <i className="bi bi-star-fill text-warning me-2"></i>
          Opiniones
        </h1>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tabActiva === "pendientes" ? "active" : ""}`}
            onClick={() => setTabActiva("pendientes")}
          >
            Pendientes
            {resenasPendientes.length > 0 && (
              <span className="badge bg-primary ms-2">{resenasPendientes.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tabActiva === "realizadas" ? "active" : ""}`}
            onClick={() => setTabActiva("realizadas")}
          >
            Realizadas
            {resenasRealizadas.length > 0 && (
              <span className="badge bg-success ms-2">{resenasRealizadas.length}</span>
            )}
          </button>
        </li>
      </ul>

      {/* Contenido */}
      {tabActiva === "pendientes" && (
        <div>
          {resenasPendientes.length > 0 ? (
            <>
              <p className="text-muted mb-4">
                Opina y ayuda a más personas
              </p>
              {resenasPendientes.length > 0 && (
                <p className="text-muted small mb-4">
                  Tienes {resenasPendientes.length} {resenasPendientes.length === 1 ? 'opinión pendiente' : 'opiniones pendientes'}
                </p>
              )}

              <div className="row g-4">
                {resenasPendientes.map((producto) => (
                  <div key={producto.id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          {/* Imagen del producto */}
                          <div className="col-md-2 text-center mb-3 mb-md-0">
                            <img
                              src={producto.imagen}
                              alt={producto.nombre}
                              className="img-fluid rounded"
                              style={{ maxHeight: "80px", objectFit: "contain" }}
                            />
                          </div>

                          {/* Información del producto */}
                          <div className="col-md-7">
                            <h6 className="fw-semibold mb-2">{producto.nombre}</h6>
                            <p className="text-muted small mb-0">
                              Comprado el {new Date(producto.fechaCompra).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>

                          {/* Estrellas de calificación */}
                          <div className="col-md-3 text-end">
                            <div className="d-flex gap-2 justify-content-end mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`bi bi-star${
                                    star <= (hoverCalificaciones[producto.productoId] || calificaciones[producto.productoId] || 0) ? "-fill text-warning" : " text-muted"
                                  }`}
                                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                  onMouseEnter={() => setHoverCalificacion(producto.productoId, star)}
                                  onMouseLeave={() => setHoverCalificacion(producto.productoId, 0)}
                                  onClick={() => setCalificacion(producto.productoId, star)}
                                ></i>
                              ))}
                            </div>
                            <button 
                              className="btn btn-sm btn-primary mt-2"
                              onClick={() => abrirModalComentario(producto)}
                            >
                              <i className="bi bi-chat-left-text me-1"></i>
                              Agregar comentario
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-star" style={{ fontSize: "4rem", color: "#ccc" }}></i>
              <h3 className="mt-3 mb-2">No tienes reseñas pendientes</h3>
              <p className="text-muted mb-3">
                Compra productos para poder opinar sobre ellos
              </p>
              <Link to="/" className="btn btn-primary mt-3">
                <i className="bi bi-shop me-2"></i>
                Ir a la tienda
              </Link>
            </div>
          )}
        </div>
      )}

      {tabActiva === "realizadas" && (
        <div>
          {resenasRealizadas.length > 0 ? (
            <>
              <p className="text-muted mb-4">
                Has realizado {resenasRealizadas.length} {resenasRealizadas.length === 1 ? 'reseña' : 'reseñas'}
              </p>
              <div className="row g-4">
                {resenasRealizadas.map((resena) => (
                  <div key={resena.id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-2 text-center mb-3 mb-md-0">
                            <img
                              src={resena.imagen}
                              alt={resena.nombre}
                              className="img-fluid rounded"
                              style={{ maxHeight: "80px", objectFit: "contain" }}
                            />
                          </div>
                          <div className="col-md-10">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="fw-semibold mb-0">{resena.nombre}</h6>
                              <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Publicada
                              </span>
                            </div>
                            <div className="d-flex gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`bi bi-star-fill ${
                                    star <= resena.calificacion ? "text-warning" : "text-muted"
                                  }`}
                                  style={{ fontSize: "1rem" }}
                                ></i>
                              ))}
                              <span className="ms-2 small text-muted">
                                {resena.calificacion} de 5
                              </span>
                            </div>
                            {resena.comentario && (
                              <p className="mb-2 text-secondary">"{resena.comentario}"</p>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="text-muted small mb-0">
                                <i className="bi bi-calendar3 me-1"></i>
                                Opinión publicada el {new Date(resena.fechaResena).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                                {resena.fechaEdicion && (
                                  <span className="ms-2">
                                    (Editada el {new Date(resena.fechaEdicion).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })})
                                  </span>
                                )}
                              </p>
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => abrirModalEdicion(resena)}
                                >
                                  <i className="bi bi-pencil me-1"></i>
                                  Editar
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => eliminarResena(resena)}
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-text" style={{ fontSize: "4rem", color: "#ccc" }}></i>
              <h3 className="mt-3 mb-2">No has realizado reseñas aún</h3>
              <p className="text-muted">Comparte tu opinión sobre los productos que compraste</p>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => setTabActiva("pendientes")}
              >
                <i className="bi bi-star me-2"></i>
                Ver productos pendientes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para agregar comentario */}
      {mostrarModal && productoSeleccionado && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={cerrarModal}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {modoEdicion ? "Editar tu opinión" : "Escribe tu opinión"}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={cerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Producto */}
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  <img 
                    src={productoSeleccionado.imagen} 
                    alt={productoSeleccionado.nombre}
                    className="rounded"
                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                  />
                  <div>
                    <h6 className="mb-1 fw-semibold">{productoSeleccionado.nombre}</h6>
                    <small className="text-muted">S/ {productoSeleccionado.precio?.toFixed(2)}</small>
                  </div>
                </div>

                {/* Calificación */}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-3">
                    Calificación <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi bi-star${
                          star <= (hoverCalificaciones[productoSeleccionado.productoId] || calificaciones[productoSeleccionado.productoId] || 0) 
                            ? "-fill text-warning" 
                            : " text-muted"
                        }`}
                        style={{ fontSize: "2rem", cursor: "pointer" }}
                        onMouseEnter={() => setHoverCalificacion(productoSeleccionado.productoId, star)}
                        onMouseLeave={() => setHoverCalificacion(productoSeleccionado.productoId, 0)}
                        onClick={() => setCalificacion(productoSeleccionado.productoId, star)}
                      ></i>
                    ))}
                    <span className="ms-2 align-self-center fw-semibold">
                      {calificaciones[productoSeleccionado.productoId] || 0} de 5
                    </span>
                  </div>
                </div>

                {/* Comentario */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Comentario (opcional)
                  </label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    placeholder="Cuéntanos tu experiencia con este producto..."
                    value={comentarios[productoSeleccionado.productoId] || ""}
                    onChange={(e) => setComentarios(prev => ({
                      ...prev,
                      [productoSeleccionado.productoId]: e.target.value
                    }))}
                  ></textarea>
                  <small className="text-muted">
                    Mínimo 10 caracteres, máximo 500 caracteres
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={guardarResena}
                >
                  <i className={`bi ${modoEdicion ? 'bi-check-circle' : 'bi-send'} me-2`}></i>
                  {modoEdicion ? "Guardar cambios" : "Publicar opinión"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
