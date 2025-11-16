{/*import productos from "../data/productos";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export const Pago = () => {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return <h2>Producto no encontrado</h2>;
  }

  return (
    <div
      className="container mt-4 mt-5"
      style={{
        maxWidth: "1080px",
        padding: "3rem",
        border: "1px solid rgba(0, 0, 0, 0.175)",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 mb-4">
          <div className="border p-4">
            <h4 className="mb-4 fw-bold">¿Cómo quieres pagar?</h4>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="debito"
              />
              <label className="form-check-label" htmlFor="debito">
                Nueva Tarjeta de débito
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="credito"
              />
              <label className="form-check-label" htmlFor="credito">
                Nueva Tarjeta de crédito
              </label>
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="radio"
                name="metodoPago"
                id="visaGuardada"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="visaGuardada">
                Visa 123-456-789
              </label>
            </div>

            <div className="text-end">
              <Link to={"detalle"} className="btn btn-dark fw-semibold px-4">
                Continuar
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="border p-3 text-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid mb-3"
              style={{ maxHeight: "80px", objectFit: "contain" }}
            />
            <p className="mb-1 fw-semibold">{producto.nombre}</p>
            <p className="mb-1">Cantidad: 1</p>
            <p className="mb-1">
              Producto:{" "}
              <span className="fw-semibold">S/ {producto.precio}</span>
            </p>
            <p className="mb-1">
              Envío: <span className="fw-semibold">Gratis</span>
            </p>
            <hr />
            <p className="mb-0 fw-semibold">Pagar: S/ {producto.precio}</p>
          </div>
        </div>
      </div>
    </div>
  );
*/}
