import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container-xl py-5 text-center" style={{ minHeight: "60vh" }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="col-md-6">
          <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "5rem" }}></i>
          <h1 className="display-1 fw-bold mt-4">404</h1>
          <h2 className="fw-bold mb-3">Página No Encontrada</h2>
          <p className="text-muted mb-4">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/" className="btn btn-custom btn-lg">
            <i className="bi bi-house-fill me-2"></i>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

