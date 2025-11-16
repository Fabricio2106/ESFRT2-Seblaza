import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones básicas
    if (!nombre || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos",
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos 6 caracteres",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(email, password, { nombre });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear cuenta",
        text: "No se pudo crear la cuenta",
      });
      setLoading(false);
      return;
    }

    if (data) {
      Swal.fire({
        icon: "success",
        title: "¡Cuenta creada!",
        text: "Revisa tu correo para confirmar tu cuenta",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/ingreso");
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
        Crear Cuenta
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
        {/* Usuario */}
        <div>
          <label
            style={{
              fontSize: "0.9rem",
              color: "#b3b3b3",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Usuario
          </label>
          <input
            type="text"
            placeholder=""
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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

        {/* Contraseña */}
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
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>

        {/* Enlace a Login */}
        <p
          style={{
            fontSize: "0.85rem",
            marginTop: "1rem",
            color: "#b3b3b3",
            textAlign: "center",
          }}
        >
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/ingreso"
            style={{
              color: "#a073ff",
              textDecoration: "none",
              fontWeight: "500",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#c8a4ff")}
            onMouseLeave={(e) => (e.target.style.color = "#a073ff")}
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
