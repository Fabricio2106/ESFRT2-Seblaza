import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const AuthLayout = () => {
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setFade(true);          // inicia fade in
    setTimeout(() => setVisible(true), 200);
    return () => setFade(false); // al salir, fade out
  }, [location.pathname]);

  const title = "Bienvenido";
  const brand =
    location.pathname === "/ingreso/registro"
      ? "Crea tu cuenta"
      : "Ingresa tu cuenta";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#1E1E1E",
        opacity: fade ? 1 : 0,
        transition: "opacity 0.5s ease", // <-- animación de desvanecimiento
      }}
    >
      {/* ... mitad izquierda y derecha como antes ... */}
      <div
        style={{
          flex: 1,
          backgroundImage: "url('/login.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          position: "relative",
        }}
      >
        {/* Overlay oscuro para mejorar la legibilidad del texto */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        ></div>

        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "700", 
            color: "#fff", 
            letterSpacing: "2px", 
            marginBottom: "0.5rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}>
            {title}
          </h1>
          <h2 style={{ 
            fontSize: "2.2rem", 
            fontWeight: "600", 
            color: "#fff", 
            letterSpacing: "4px", 
            marginTop: "0.5rem", 
            display: "inline-block",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}>
            {brand.split("").map((char, i) => (
              <span key={i} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(15px)", transition: `all 0.4s ease ${i * 0.08}s` }}>
                {char}
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: "#1E1E1E", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "80%", maxWidth: "380px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
