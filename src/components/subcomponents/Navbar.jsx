import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUser } from "react-icons/fa";
import { RiBook2Fill } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";
import { useEffect } from "react";
import * as bootstrap from "bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { useCarrito } from "../../hooks/useCarrito";
import Swal from "sweetalert2";

export default function Navbar1() {
  const { user, signOut } = useAuth();
  const { obtenerCantidadTotal } = useCarrito();
  const navigate = useNavigate();
  const cantidadCarrito = obtenerCantidadTotal();

  useEffect(() => {
    // Inicializa los dropdowns de Bootstrap (necesario en React + Vite)
    const dropdownElementList = [].slice.call(document.querySelectorAll(".dropdown-toggle"));
    dropdownElementList.map((dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl));
  }, []);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que quieres cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const { error } = await signOut();
      if (!error) {
        navigate("/", { replace: true });
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

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
              Visítanos en <strong>San Martín de Porres, Av. Perú 123</strong>
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

      {/* Navbar principal */}
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
            {/* <RiBook2Fill size={34} className="me-2" /> */}
            <img src="/logo-seblaza.webp" alt="Seblaza Logo" style={{ height: "50px" }} />
          </Link>
            

          {/* Menú centrado */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav text-center d-flex align-items-center gap-4">
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/">
                  Home
                </Link>
              </li>

              {/* Productos */}
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

              <li className="nav-item">
                <Link className="nav-link fw-semibold px-3" to="/contacto">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Íconos derecha */}
          <div className="d-flex align-items-center gap-4 ms-4">

            {/* Ícono de usuario (Inicio de sesión) */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 text-dark text-decoration-none border-0 bg-transparent dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ padding: 0 }}
                >
                  <FaUser size={20} />
                  <span className="fw-semibold" style={{ fontSize: "0.95rem" }}>
                    {user.user_metadata?.nombre || user.email.split("@")[0]}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end border-0 shadow-sm"
                  aria-labelledby="userDropdown"
                  style={{ minWidth: "200px" }}
                >
                  <li>
                    <div className="dropdown-item-text">
                      <small className="text-muted">Conectado como:</small>
                      <div className="fw-semibold">{user.email}</div>
                    </div>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/mi-perfil">
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/mis-pedidos">
                      <i className="bi bi-bag me-2"></i>
                      Mis Pedidos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/mis-resenas">
                      <i className="bi bi-star me-2"></i>
                      Opiniones
                    </Link>
                  </li>
                  {(user?.user_metadata?.rol === 'administrador' || user?.email === 'davidgarcia241296@gmail.com') && (
                    <>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link className="dropdown-item text-primary fw-semibold" to="/admin">
                          <i className="bi bi-speedometer2 me-2"></i>
                          Panel de Administración
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleSignOut}>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/ingreso" className="text-dark text-decoration-none d-flex align-items-center gap-2">
                <FaUser size={20} />
                <span className="fw-semibold" style={{ fontSize: "0.95rem" }}>
                  Iniciar Sesión
                </span>
              </Link>
            )}

            {/* Carrito */}
            <Link to="/carrito" className="position-relative text-dark">
              <BsCart3 size={20} />
              {cantidadCarrito > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                  style={{ fontSize: "0.6rem" }}
                >
                  {cantidadCarrito}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
