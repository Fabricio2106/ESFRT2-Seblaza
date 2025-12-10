import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../config/supaBaseConfig";
import { useCarrito } from "../hooks/useCarrito";
import { usePedidos } from "../hooks/usePedidos";
import Swal from "sweetalert2";

export default function Pago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { carrito, vaciarCarrito } = useCarrito();
  const { agregarPedido } = usePedidos();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metodoPago, setMetodoPago] = useState("credito");
  const [procesando, setProcesando] = useState(false);
  
  // Estados para el formulario de envío
  const [datosEnvio, setDatosEnvio] = useState({
    nombreCompleto: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    email: "",
    notasAdicionales: ""
  });

  // Determinar si es pago desde carrito o desde producto individual
  const esDesdeCarrito = location.pathname === "/carrito/pago";
  const productosAPagar = esDesdeCarrito ? carrito : [];

  useEffect(() => {
    const fetchProducto = async () => {
      if (!esDesdeCarrito && id) {
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
      } else {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id, esDesdeCarrito]);

  const handlePagar = async () => {
    // Validar que los campos requeridos estén llenos
    if (!datosEnvio.nombreCompleto.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu nombre completo",
      });
      return;
    }
    
    if (!datosEnvio.direccion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu dirección",
      });
      return;
    }
    
    if (!datosEnvio.ciudad.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu ciudad",
      });
      return;
    }
    
    if (!datosEnvio.codigoPostal.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu código postal",
      });
      return;
    }
    
    if (!datosEnvio.telefono.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu teléfono",
      });
      return;
    }
    
    if (!datosEnvio.email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor, ingresa tu correo electrónico",
      });
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datosEnvio.email)) {
      Swal.fire({
        icon: "warning",
        title: "Email inválido",
        text: "Por favor, ingresa un correo electrónico válido",
      });
      return;
    }
    
    setProcesando(true);
    
    try {
      // Preparar datos del pedido
      let productosDelPedido;
      if (esDesdeCarrito) {
        productosDelPedido = carrito.map(item => ({
          id: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
          imagen: item.img_url || item.imagen
        }));
      } else {
        productosDelPedido = [{
          id: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precio: producto.precio,
          imagen: producto.img_url
        }];
      }

      // Crear el pedido
      const nuevoPedido = {
        productos: productosDelPedido,
        total: total,
        metodoPago: metodoPago === "credito" ? "Tarjeta de crédito" : 
                    metodoPago === "debito" ? "Tarjeta de débito" :
                    metodoPago === "paypal" ? "PayPal" : "Yape/Plin",
        direccionEnvio: {
          nombreCompleto: datosEnvio.nombreCompleto,
          direccion: datosEnvio.direccion,
          ciudad: datosEnvio.ciudad,
          codigoPostal: datosEnvio.codigoPostal,
          telefono: datosEnvio.telefono,
          email: datosEnvio.email,
          notasAdicionales: datosEnvio.notasAdicionales
        }
      };

      // Guardar el pedido en Supabase
      await agregarPedido(nuevoPedido);
      
      // Si es desde carrito, vaciar el carrito después del pago
      if (esDesdeCarrito) {
        vaciarCarrito();
      }
      
      setProcesando(false);
      
      Swal.fire({
        icon: "success",
        title: "¡Pago Exitoso!",
        text: "Tu pedido ha sido procesado correctamente",
        confirmButtonText: "Ver mis pedidos",
      }).then(() => {
        navigate("/mis-pedidos");
      });
    } catch (error) {
      setProcesando(false);
      console.error("Error al procesar el pago:", error);
      console.error("Mensaje de error:", error?.message);
      console.error("Detalles del error:", error?.details);
      
      let mensajeError = "Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.";
      
      if (error?.message) {
        mensajeError = error.message;
      } else if (error?.details) {
        mensajeError = error.details;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error al procesar el pago",
        text: mensajeError,
        footer: error?.hint || ""
      });
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si es desde producto individual y no hay producto
  if (!esDesdeCarrito && !producto) {
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

  // Si es desde carrito y el carrito está vacío
  if (esDesdeCarrito && carrito.length === 0) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-cart-x" style={{ fontSize: "3rem", color: "#dc3545" }}></i>
        <h2 className="mt-3">Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-custom mt-3">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  // Calcular totales
  let subtotal, envio, total;
  
  if (esDesdeCarrito) {
    subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    envio = subtotal > 100 ? 0 : 15;
    total = subtotal + envio;
  } else {
    subtotal = producto.precio;
    envio = subtotal > 100 ? 0 : 15;
    total = subtotal + envio;
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Inicio</Link>
          </li>
          {esDesdeCarrito ? (
            <>
              <li className="breadcrumb-item">
                <Link to="/carrito" className="text-decoration-none">Carrito</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Pago
              </li>
            </>
          ) : (
            <>
              <li className="breadcrumb-item">
                <Link to={`/producto/${id}`} className="text-decoration-none">Producto</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/producto/${id}/comprar`} className="text-decoration-none">Comprar</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Pago
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Título */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
          Método de Pago
        </h1>
        <div style={{ 
          width: "80px", 
          height: "4px", 
          backgroundColor: "#0d6efd", 
          borderRadius: "2px",
          margin: "0 auto"
        }}></div>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Columna Izquierda - Métodos de Pago */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="fw-bold mb-4">
              <i className="bi bi-credit-card-2-front me-2 text-primary"></i>
              ¿Cómo quieres pagar?
            </h3>

            {/* Tarjeta de Crédito */}
            <div className="form-check border rounded p-3 mb-3" style={{ cursor: "pointer" }}>
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="credito"
                value="credito"
                checked={metodoPago === "credito"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label className="form-check-label d-flex align-items-center" htmlFor="credito" style={{ cursor: "pointer" }}>
                <i className="bi bi-credit-card text-primary me-2" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <strong>Tarjeta de Crédito</strong>
                  <small className="d-block text-muted">Visa, Mastercard, American Express</small>
                </div>
              </label>
            </div>

            {/* Tarjeta de Débito */}
            <div className="form-check border rounded p-3 mb-3" style={{ cursor: "pointer" }}>
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="debito"
                value="debito"
                checked={metodoPago === "debito"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label className="form-check-label d-flex align-items-center" htmlFor="debito" style={{ cursor: "pointer" }}>
                <i className="bi bi-credit-card-fill text-success me-2" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <strong>Tarjeta de Débito</strong>
                  <small className="d-block text-muted">Visa, Mastercard</small>
                </div>
              </label>
            </div>

            {/* PayPal */}
            <div className="form-check border rounded p-3 mb-3" style={{ cursor: "pointer" }}>
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="paypal"
                value="paypal"
                checked={metodoPago === "paypal"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label className="form-check-label d-flex align-items-center" htmlFor="paypal" style={{ cursor: "pointer" }}>
                <i className="bi bi-paypal text-info me-2" style={{ fontSize: "1.5rem" }}></i>
                <div>
                  <strong>PayPal</strong>
                  <small className="d-block text-muted">Paga con tu cuenta PayPal</small>
                </div>
              </label>
            </div>

           

          </div>

          {/* Información de Envío */}
          <div className="bg-white p-4 rounded shadow-sm mt-4">
            <h3 className="fw-bold mb-4">
              <i className="bi bi-truck me-2 text-primary"></i>
              Información de Envío
            </h3>

            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre Completo <span className="text-danger">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder=""
                value={datosEnvio.nombreCompleto}
                onChange={(e) => setDatosEnvio({...datosEnvio, nombreCompleto: e.target.value})}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Dirección <span className="text-danger">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder=""
                value={datosEnvio.direccion}
                onChange={(e) => setDatosEnvio({...datosEnvio, direccion: e.target.value})}
              />
            </div>
            
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Ciudad <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder=""
                  value={datosEnvio.ciudad}
                  onChange={(e) => setDatosEnvio({...datosEnvio, ciudad: e.target.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Código Postal <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder=""
                  value={datosEnvio.codigoPostal}
                  onChange={(e) => setDatosEnvio({...datosEnvio, codigoPostal: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Teléfono <span className="text-danger">*</span></label>
              <input 
                type="tel" 
                className="form-control" 
                placeholder=""
                value={datosEnvio.telefono}
                onChange={(e) => setDatosEnvio({...datosEnvio, telefono: e.target.value})}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo Electrónico <span className="text-danger">*</span></label>
              <input 
                type="email" 
                className="form-control" 
                placeholder=""
                value={datosEnvio.email}
                onChange={(e) => setDatosEnvio({...datosEnvio, email: e.target.value})}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Notas adicionales (opcional)</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Instrucciones especiales para la entrega..."
                value={datosEnvio.notasAdicionales}
                onChange={(e) => setDatosEnvio({...datosEnvio, notasAdicionales: e.target.value})}
              ></textarea>
            </div>

            {/* Botones */}
            <div className="d-flex gap-3 mt-4">
              <Link 
                to={esDesdeCarrito ? "/carrito" : `/producto/${id}/comprar`}
                className="btn btn-outline-secondary flex-grow-1"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </Link>
              <button 
                className="btn btn-custom flex-grow-1"
                onClick={handlePagar}
                disabled={procesando}
              >
                {procesando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Pago
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Resumen */}
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded shadow-sm sticky-top" style={{ top: "20px" }}>
            <h3 className="fw-bold mb-4">
              <i className="bi bi-receipt me-2 text-primary"></i>
              Resumen del Pedido
            </h3>

            {/* Productos */}
            {esDesdeCarrito ? (
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Productos ({carrito.length})</h6>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {carrito.map((item) => (
                    <div key={item.id} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                      <img
                        src={item.img_url || item.imagen}
                        alt={item.nombre}
                        className="rounded"
                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>{item.nombre}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                          {item.cantidad} x S/ {item.precio.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-end">
                        <strong>S/ {(item.precio * item.cantidad).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <img
                  src={producto.img_url}
                  alt={producto.nombre}
                  className="rounded"
                  style={{ width: "80px", height: "80px", objectFit: "contain" }}
                />
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1">{producto.nombre}</h6>
                  <p className="text-muted mb-0">Cantidad: 1</p>
                </div>
              </div>
            )}

            {/* Desglose */}
            <div className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>S/ {subtotal.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <strong>S/ {envio.toFixed(2)}</strong>
              </div>
            </div>

            {/* Total */}
            <div className="d-flex justify-content-between mb-4">
              <h4 className="fw-bold">Total a Pagar:</h4>
              <h4 className="fw-bold text-success">S/ {total.toFixed(2)}</h4>
            </div>

            {/* Seguridad */}
            <div className="p-3 bg-light rounded text-center">
              <i className="bi bi-shield-check text-success" style={{ fontSize: "2rem" }}></i>
              <p className="mb-0 mt-2 small text-muted">
                <strong>Pago 100% seguro</strong><br />
                Tus datos están protegidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
