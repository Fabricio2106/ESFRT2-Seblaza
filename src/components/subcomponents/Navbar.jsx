import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { RiBook2Fill } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs"; // carrito

export default function Navbar1() {
  return (
    <>
      {/* Barra superior negra */}
      <div className="bg-dark text-white py-2 small">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <span className="me-3">Lun-Vie: <strong>8:00 AM - 5:30 PM</strong></span>
            <span>Visítanos en <strong>1234 Street Address City Address, 1234</strong></span>
          </div>
          <div className="d-flex align-items-center mt-2 mt-md-0">
            <span className="me-3">Llámanos: <strong>(00) 1234 5678</strong></span>
            <a href="#" className="text-white me-3"><FaFacebookF /></a>
            <a href="#" className="text-white"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Navbar principal blanca */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container py-3 d-flex align-items-center justify-content-between">

          {/* Logo a la izquierda */}
          <Link className="navbar-brand text-primary d-flex align-items-center" to="/">
            <RiBook2Fill size={34} className="me-2" />
          </Link>

          {/* Menú centrado */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/extractores-bano">Extractores de baño</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/extractores-cocina">Extractores de cocina</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/ventiladores">Ventiladores</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/aire-acondicionado">Aire acondicionado</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Sección derecha: cuenta, login, íconos */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/crear-cuenta" className="text-dark text-decoration-none fw-semibold">Crea tu cuenta</Link>
            <Link to="/ingresar" className="text-dark text-decoration-none fw-semibold">Ingresa</Link>
            
            {/* Ícono de búsqueda */}
            <button className="btn btn-link text-dark p-0">
              <IoIosSearch size={20} />
            </button>

            {/* Carrito con contador */}
            <Link to="/carrito" className="position-relative text-dark">
              <BsCart3 size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: "0.6rem" }}>
                2
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}



