import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const title = "Bienvenido";
  const brand = "Ingresa tu cuenta ";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#1E1E1E",
      }}
    >
      {/* Mitad izquierda */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#D9D9D9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* Animación de entrada */}
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease",
          }}
        >
          {/* “Welcome” */}
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "#000",
              letterSpacing: "2px",
              marginBottom: "0.5rem",
            }}
          >
            {title}
          </h1>

          {/* animacion */}
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: "600",
              color: "#000",
              letterSpacing: "4px",
              marginTop: "0.5rem",
              display: "inline-block",
            }}
          >
            {brand.split("").map((char, i) => (
              <span
                key={i}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(15px)",
                  transition: `all 0.4s ease ${i * 0.08}s`,
                }}
              >
                {char}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Mitad derecha */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#1E1E1E",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "80%", maxWidth: "380px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
