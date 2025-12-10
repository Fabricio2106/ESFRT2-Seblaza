import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../config/supaBaseConfig";

export default function ComprarAhora() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al cargar producto:", error);
        setProducto(null);
      } else {
        setProducto(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "3rem", color: "#dc3545" }}></i>
        <h2 className="mt-3">Producto no encontrado</h2>
        <Link to="/" className="btn btn-custom mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const subtotal = producto.precio * cantidad;
  const envio = subtotal > 100 ? 0 : 15;
  const total = subtotal + envio;

  return (
    <div className="container-xl py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/producto/${id}`} className="text-decoration-none">Producto</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Comprar Ahora
          </li>
        </ol>
      </nav>

      {/* Título */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
          Finalizar Compra
        </h1>
        <div style={{ 
          width: "80px", 
          height: "4px", 
          backgroundColor: "#0d6efd", 
          borderRadius: "2px",
          margin: "0 auto"
        }}></div>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda - Resumen del Producto */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h3 className="fw-bold mb-4">
              <i className="bi bi-bag-check me-2 text-primary"></i>
              Resumen del Producto
            </h3>
            
            <div className="d-flex align-items-start gap-4">
              <img
                src={producto.img_url}
                alt={producto.nombre}
                className="rounded"
                style={{ width: "150px", height: "150px", objectFit: "contain" }}
              />
              
              <div className="flex-grow-1">
                <h5 className="fw-bold mb-2">{producto.nombre}</h5>
                {producto.marca && (
                  <p className="text-muted mb-1">
                    <strong>Marca:</strong> {producto.marca}
                  </p>
                )}
                {producto.modelo && (
                  <p className="text-muted mb-1">
                    <strong>Modelo:</strong> {producto.modelo}
                  </p>
                )}
                <p className="text-muted mb-3">
                  <strong>Stock:</strong> 
                  <span className="text-success ms-1">{producto.stock} disponibles</span>
                </p>
                
                <div className="d-flex align-items-center gap-3">
                  <label className="fw-semibold">Cantidad:</label>
                  <div className="input-group" style={{ width: "150px" }}>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => cantidad > 1 && setCantidad(cantidad - 1)}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={cantidad}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val >= 1 && val <= producto.stock) {
                          setCantidad(val);
                        }
                      }}
                      min="1"
                      max={producto.stock}
                    />
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => cantidad < producto.stock && setCantidad(cantidad + 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Resumen de Compra */}
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: "20px" }}>
            <h3 className="fw-bold mb-4">
              <i className="bi bi-receipt me-2 text-primary"></i>
              Resumen de Compra
            </h3>
            
            <div className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cantidad} {cantidad === 1 ? 'producto' : 'productos'}):</span>
                <strong>S/ {subtotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <strong className={envio === 0 ? 'text-success' : ''}>
                  {envio === 0 ? 'GRATIS' : `S/ ${envio.toFixed(2)}`}
                </strong>
              </div>
              {subtotal < 100 && (
                <small className="text-muted">
                  Compra S/ {(100 - subtotal).toFixed(2)} más para envío gratis
                </small>
              )}
            </div>
            
            <div className="d-flex justify-content-between mb-4">
              <h4 className="fw-bold">Total:</h4>
              <h4 className="fw-bold text-success">S/ {total.toFixed(2)}</h4>
            </div>
            
            <Link to={`/producto/${id}/pago`} className="btn btn-custom w-100 py-3 mb-3 text-decoration-none d-block text-center">
              <i className="bi bi-credit-card me-2"></i>
              Proceder al Pago
            </Link>
            
            <Link to={`/producto/${id}`} className="btn btn-outline-secondary w-100">
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Producto
            </Link>
            
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-credit-card-2-front me-2 text-primary"></i>
                Métodos de Pago Aceptados:
              </h6>
              <div className="d-flex gap-2 flex-wrap justify-content-center">
                <span className="badge bg-primary px-3 py-2" style={{ fontSize: "0.9rem" }}>
                  <i className="bi bi-credit-card me-1"></i>Visa
                </span>
                <span className="badge bg-primary px-3 py-2" style={{ fontSize: "0.9rem" }}>
                  <i className="bi bi-credit-card me-1"></i>Mastercard
                </span>
                <span className="badge bg-info px-3 py-2" style={{ fontSize: "0.9rem" }}>
                  <i className="bi bi-wallet2 me-1"></i>PayPal
                </span>
                <span className="badge bg-success px-3 py-2" style={{ fontSize: "0.9rem" }}>
                  <i className="bi bi-bank me-1"></i>Transferencia
                </span>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <i className="bi bi-shield-check text-success me-2"></i>
                Compra 100% segura y protegida
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
