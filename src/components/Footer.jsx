export default function Footer() {
  return (
    <footer
      className="text-white py-5"
      style={{ backgroundColor: "#000", fontSize: "0.9rem" }}
    >
      <div className="container">
        {/* --- Iconos sociales --- */}
        <div className="d-flex justify-content-center mb-3">
          <i className="bi bi-facebook mx-2 fs-5"></i>
          <i className="bi bi-telegram mx-2 fs-5"></i>
          <i className="bi bi-instagram mx-2 fs-5"></i>
          <i className="bi bi-pinterest mx-2 fs-5"></i>
        </div>

        {/* --- Enlaces del menú + botón --- */}
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-4">
          <ul className="list-inline mb-3 mb-md-0 text-center text-md-start">
            <li className="list-inline-item mx-3">
              <a href="#" className="text-white text-decoration-none">
                About
              </a>
            </li>
            <li className="list-inline-item mx-3">
              <a href="#" className="text-white text-decoration-none">
                Features
              </a>
            </li>
            <li className="list-inline-item mx-3">
              <a href="#" className="text-white text-decoration-none">
                Pricing
              </a>
            </li>
            <li className="list-inline-item mx-3">
              <a href="#" className="text-white text-decoration-none">
                Gallery
              </a>
            </li>
            <li className="list-inline-item mx-3">
              <a href="#" className="text-white text-decoration-none">
                Team
              </a>
            </li>
          </ul>

          {/* Botón "Contáctanos" alineado al final */}
          <div className="ms-md-4">
            <button
              className="btn btn-light rounded-pill px-4"
              style={{ fontWeight: "500" }}
            >
              Contáctanos
            </button>
          </div>
        </div>

        {/* --- Línea separadora --- */}
        <hr
          className="border-light opacity-25 mb-3"
          style={{ width: "95%", margin: "0 auto" }}
        />

        {/* --- Texto final --- */}
        <p className="text-muted small text-center mb-0">
          © 2025 SEBILAZA | Equipos de ventilación y aire acondicionado
        </p>
      </div>
    </footer>
  );
}
