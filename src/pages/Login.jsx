import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones básicas
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await signIn(email, password);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Credenciales incorrectas",
      });
      setLoading(false);
      return;
    }

    if (data) {
      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Has iniciado sesión correctamente",
        timer: 1500,
        showConfirmButton: false,
      });
      
      // Verificar si es administrador
      const adminEmails = ['davidgarcia241296@gmail.com'];
      const isAdmin = data.user?.user_metadata?.rol === 'administrador' || adminEmails.includes(data.user?.email);
      
      // Redirigir según el tipo de usuario
      if (redirect) {
        navigate(redirect);
      } else if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          marginBottom: "2rem",
          textAlign: "center",
          color: "white",
        }}
      >
        Login
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          width: "100%",
        }}
      >
        {/* Email */}
        <div>
          <label
            style={{
              fontSize: "0.9rem",
              color: "#b3b3b3",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px 0",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid #555",
              color: "white",
              outline: "none",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Campo Contraseña */}
        <div>
          <label
            style={{
              fontSize: "0.9rem",
              color: "#b3b3b3",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Contraseña
          </label>
          <input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px 0",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid #555",
              color: "white",
              outline: "none",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            backgroundColor: loading ? "#890404ff" : "#890404ff",
            border: "none",
            borderRadius: "25px",
            color: "white",
            fontWeight: "600",
            padding: "12px 0",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#000000ff")}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#890404ff")}
        >
          {loading ? "Cargando..." : "Login"}
        </button>

        {/* Enlace */}
        <p
          style={{
            fontSize: "0.85rem",
            marginTop: "1rem",
            color: "#b3b3b3",
            textAlign: "center",
          }}
        >
          ¿No tienes una cuenta?{" "}
        <Link
            to="/ingreso/registro"
              style={{
                          color: "#a073ff",
                          textDecoration: "none",
                          fontWeight: "500",
                          transition: "color 0.3s ease",
                                  }}
                                  onMouseEnter={(e) => (e.target.style.color = "#c8a4ff")}
                                  onMouseLeave={(e) => (e.target.style.color = "#a073ff")}
              >
               Crear una
              </Link>

        </p>
      </form>
    </div>
  );
}