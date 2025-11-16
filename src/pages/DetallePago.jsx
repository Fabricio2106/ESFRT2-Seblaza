{/*import productos from "../data/productos";
import { useParams, Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaCarSide } from "react-icons/fa";
import Swal from "sweetalert2";

export const DetallePago = () => {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return <h2>Producto no encontrado</h2>;
  }
  const handleClick = () => {
    Swal.fire({
      title: "Compra exitosa",
      text: "Gracias por su compra.",
      icon: "success",
    });
  };

  return (
    <div
      className="container mt-4"
      style={{
        maxWidth: "1080px",
        padding: "3rem",
        border: "1px solid rgba(0, 0, 0, 0.175)",
      }}
    >
      <div className="d-flex justify-content-between">
        <div className="w-75 pe-3">
          <div className="border rounded p-4 mb-4">
            <h5 className="fw-bold mb-3">Detalle del envío</h5>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <i className="bi bi-geo-alt-fill me-2"></i>{" "}
                <FaLocationDot size={20} /> Dirección del cliente
              </div>
              <Link to="#" className="text-decoration-underline text-dark">
                Elegir otro método
              </Link>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-truck me-2"></i>
                <FaCarSide size={22} /> Llega mañana a su domicilio
              </div>
              <Link to="#" className="text-decoration-underline text-dark">
                modificar
              </Link>
            </div>
          </div>

          <div className="border rounded p-4">
            <h5 className="fw-bold mb-3">Detalle del pago</h5>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                  alt="Visa"
                  style={{ height: "20px" }}
                  className="me-2"
                />
                123-456-789
              </div>
              <Link to="#" className="text-decoration-underline text-dark">
                modificar
              </Link>
            </div>
          </div>
        </div>

        <div className="w-25 border rounded p-3 text-center">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid mb-3"
            style={{ maxHeight: "80px", objectFit: "contain" }}
          />
          <p className="fw-semibold">Descripción del Producto</p>
          <p className="mb-1">Cantidad: 1</p>
          <p className="mb-1">Producto: S/ {producto.precio}</p>
          <p className="mb-1">Envío: Gratis</p>
          <hr />
          <p className="fw-semibold">Pagar: S/ {producto.precio}</p>
          <button
            className="btn btn-dark fw-semibold w-100 mt-2"
            onClick={handleClick}
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  );
};
*/}
