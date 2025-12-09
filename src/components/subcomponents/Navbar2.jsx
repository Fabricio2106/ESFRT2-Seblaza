import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUser } from "react-icons/fa";
import { RiBook2Fill } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";
import { useEffect } from "react";
import * as bootstrap from "bootstrap";
import { useAuth } from "../../hooks/useAuth";

import Swal from "sweetalert2";

export default function Navbar2() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();
 
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
                  <Link className="dropdown-item" to="/">
                    Ir a la tienda
                  </ Link>
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

        </div>
      </nav >
    </>
  );
}
