import { Link } from "react-router-dom";

export default function Registro() {
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
          style={{
            marginTop: "1rem",
            backgroundColor: "#bcbcbc",
            border: "none",
            borderRadius: "25px",
            color: "white",
            fontWeight: "600",
            padding: "12px 0",
            cursor: "pointer",
            transition: "0.3s",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#a6a6a6")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#bcbcbc")}
        >
          Crear Cuenta
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
