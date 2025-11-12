import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUser } from "react-icons/fa";
import { RiBook2Fill } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";
import { useEffect } from "react";
import * as bootstrap from "bootstrap";

export default function Navbar1() {
  useEffect(() => {
    // Inicializa los dropdowns de Bootstrap (necesario en React + Vite)
    const dropdownElementList = [].slice.call(document.querySelectorAll(".dropdown-toggle"));
    dropdownElementList.map((dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl));
  }, []);

  return (
    <>
      {/* Barra superior negra */}
      <div className="bg-dark text-white py-2 small">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <span className="me-3">
              Lun-Vie: <strong>8:00 AM - 5:30 PM</strong>
            </span>
            <span>
              Visítanos en <strong>1234 Street Address City Address, 1234</strong>
            </span>
          </div>
          <div className="d-flex align-items-center mt-2 mt-md-0">
            <span className="me-3">
              Llámanos: <strong>(00) 1234 5678</strong>
            </span>
            <a href="#" className="text-white me-3">
              <FaFacebookF />
            </a>
            <a href="#" className="text-white">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Navbar principal con margen interno */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div
          className="container d-flex align-items-center justify-content-between"
          style={{
            paddingTop: "1rem",
            paddingBottom: "1rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          {/* Logo */}
          <Link className="navbar-brand text-primary d-flex align-items-center me-4" to="/">
            <RiBook2Fill size={34} className="me-2" />
          </Link>

          {/* Menú centrado con separación */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav text-center d-flex align-items-center gap-4">
              {/* HOME */}
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/">
                  Home
                </Link>
              </li>

              {/* PRODUCTOS (menú desplegable) */}
              <li className="nav-item dropdown">
                <button
                  className="btn nav-link fw-semibold dropdown-toggle border-0 bg-transparent"
                  id="productosDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ padding: 0 }}
                >
                  Productos
                </button>
                <ul
                  className="dropdown-menu border-0 shadow-sm text-center"
                  aria-labelledby="productosDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/extractores-bano">
                      Extractores de baño
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/extractores-cocina">
                      Extractores de cocina
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/ventiladores">
                      Ventiladores
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/aire-acondicionado">
                      Aire acondicionado
                    </Link>
                  </li>
                </ul>
              </li>

              {/* CONTACTO */}
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/contacto">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Íconos derecha con espacio */}
          <div className="d-flex align-items-center gap-4 ms-4">
            <Link to="/perfil" className="text-dark text-decoration-none">
              <FaUser size={20} />
            </Link>

            <Link to="/carrito" className="position-relative text-dark">
              <BsCart3 size={20} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                style={{ fontSize: "0.6rem" }}
              >
                2
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
