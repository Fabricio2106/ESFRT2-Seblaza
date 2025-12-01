import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../hooks/useCarrito";
import Swal from "sweetalert2";

export default function Carrito() {
  const navigate = useNavigate();
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, obtenerTotal } = useCarrito();

  const handleVaciarCarrito = () => {
    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos del carrito",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        vaciarCarrito();
        Swal.fire({
          icon: "success",
          title: "Carrito vaciado",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleEliminar = (id, nombre) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: `${nombre} se eliminará del carrito`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarDelCarrito(id);
      }
    });
  };

  const handleProcederAlPago = () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "Agrega productos al carrito para continuar",
        timer: 2000
      });
      return;
    }
    // Navegar a la página de pago del carrito
    navigate("/carrito/pago");
  };

  const subtotal = obtenerTotal();
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
          <li className="breadcrumb-item active" aria-current="page">
            Carrito de Compras
          </li>
        </ol>
      </nav>

      {/* Título */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
          <i className="bi bi-cart3 me-3"></i>
          Mi Carrito de Compras
        </h1>
        <div style={{ 
          width: "80px", 
          height: "4px", 
          backgroundColor: "#0d6efd", 
          borderRadius: "2px",
          margin: "0 auto"
        }}></div>
      </div>

      {carrito.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x" style={{ fontSize: "5rem", color: "#ccc" }}></i>
          <h3 className="mt-4 mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">¡Agrega productos para comenzar tu compra!</p>
          <Link to="/" className="btn btn-custom btn-lg">
            <i className="bi bi-shop me-2"></i>
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Columna Izquierda - Productos */}
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded shadow-sm mb-3">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">
                  Productos ({carrito.length})
                </h3>
                <button 
                  className="btn btn-link text-danger text-decoration-none"
                  onClick={handleVaciarCarrito}
                >
                  <i className="bi bi-trash me-1"></i>
                  Vaciar Carrito
                </button>
              </div>

              {carrito.map((producto) => (
                <div key={producto.id} className="border-bottom pb-4 mb-4">
                  <div className="row g-3">
                    <div className="col-md-2">
                      <img
                        src={producto.img_url || producto.imagen}
                        alt={producto.nombre}
                        className="img-fluid rounded"
                        style={{ width: "100%", height: "100px", objectFit: "contain" }}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <h5 className="fw-bold mb-2">{producto.nombre}</h5>
                      <p className="text-muted mb-1">
                        <small>Stock disponible: {producto.stock}</small>
                      </p>
                      <button 
                        className="btn btn-link text-danger p-0 text-decoration-none"
                        onClick={() => handleEliminar(producto.id, producto.nombre)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Eliminar
                      </button>
                    </div>
                    
                    <div className="col-md-3">
                      <label className="form-label fw-semibold mb-2">Cantidad</label>
                      <div className="input-group">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={producto.cantidad}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            actualizarCantidad(producto.id, val);
                          }}
                          min="1"
                          max={producto.stock}
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-md-3 text-end">
                      <p className="text-muted mb-1">Precio unitario</p>
                      <p className="mb-2">S/ {producto.precio.toFixed(2)}</p>
                      <p className="fw-bold text-primary" style={{ fontSize: "1.2rem" }}>
                        S/ {(producto.precio * producto.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cupón de Descuento */}
            <div className="bg-white p-4 rounded shadow-sm">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-ticket-perforated me-2"></i>
                ¿Tienes un cupón de descuento?
              </h5>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ingresa tu código"
                  disabled
                />
                <button className="btn btn-outline-primary" disabled>
                  Aplicar
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Resumen */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: "20px" }}>
              <h3 className="fw-bold mb-4">
                <i className="bi bi-receipt me-2 text-primary"></i>
                Resumen del Pedido
              </h3>
              
              <div className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>S/ {subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <strong className={envio === 0 ? 'text-success' : ''}>
                    {envio === 0 ? 'GRATIS' : `S/ ${envio.toFixed(2)}`}
                  </strong>
                </div>
                {subtotal < 100 && (
                  <small className="text-success">
                    <i className="bi bi-truck me-1"></i>
                    Compra S/ {(100 - subtotal).toFixed(2)} más para envío gratis
                  </small>
                )}
              </div>
              
              <div className="d-flex justify-content-between mb-4">
                <h4 className="fw-bold">Total:</h4>
                <h4 className="fw-bold text-success">S/ {total.toFixed(2)}</h4>
              </div>
              
              <button 
                className="btn btn-custom w-100 py-3 mb-3"
                onClick={handleProcederAlPago}
              >
                <i className="bi bi-credit-card me-2"></i>
                Proceder al Pago
              </button>
              
              <Link to="/" className="btn btn-outline-secondary w-100 mb-4">
                <i className="bi bi-arrow-left me-2"></i>
                Seguir Comprando
              </Link>
              
              <div className="p-3 bg-light rounded">
                <h6 className="fw-bold mb-3">Beneficios de Compra:</h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <small>Envío gratis en compras mayores a S/ 100</small>
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <small>Garantía de 30 días</small>
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <small>Devolución gratuita</small>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <small>Compra 100% segura</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
