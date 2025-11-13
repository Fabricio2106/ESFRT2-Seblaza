import Carousel from "../components/subcomponents/carousel";
import { Link } from "react-router-dom";
import { comentarios } from "../data/productos";
import { useEffect, useState } from "react";
import { supabase } from "../config/supaBaseConfig";

export default function Home() {
  const [productosOferta, setProductosOferta] = useState([]);
  const [productosNormales, setProductosNormales] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productos, error } = await supabase
        .from("productos")
        .select("*");
      if (error) console.error("Error", error);
      else {
        // Filtrar productos en oferta
        const ofertas = productos.filter(p => p.estado === "oferta");
        setProductosOferta(ofertas);
        // Filtrar productos que NO están en oferta
        const normales = productos.filter(p => p.estado !== "oferta");
        setProductosNormales(normales);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Carousel />

      {/* --- Productos en Oferta --- */}
      {productosOferta.length > 0 && (
        <section className="container-xl mt-5" style={{ padding: "40px 0" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-2" style={{ fontSize: "2rem", color: "#1a1a1a" }}>
                Ofertas Especiales
              </h2>
              <div style={{ 
                width: "60px", 
                height: "4px", 
                backgroundColor: "#dc3545", 
                borderRadius: "2px" 
              }}></div>
            </div>
            <Link
              to="/productos?filter=ofertas"
              className="text-decoration-none fw-semibold d-flex align-items-center gap-2"
              style={{ 
                fontSize: "0.95rem", 
                color: "#dc3545",
                transition: "color 0.3s"
              }}
              onMouseEnter={(e) => e.target.style.color = "#b02a37"}
              onMouseLeave={(e) => e.target.style.color = "#dc3545"}
            >
              Ver todas las ofertas
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </Link>
          </div>

          <div className="row justify-content-center row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {productosOferta.slice(0, 5).map((producto) => (
              <div className="col d-flex justify-content-center" key={producto.id}>
                <Link
                  to={`/producto/${producto.id}`}
                  className="text-decoration-none"
                  style={{ width: "100%", maxWidth: "220px" }}
                >
                  <div
                    className="card border-0 text-center p-3 h-100 position-relative"
                    style={{
                      transition: "all 0.3s ease",
                      fontSize: "0.9rem",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      borderRadius: "12px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                    }}
                  >
                    {/* Badge de Oferta */}
                    <span
                      className="position-absolute badge"
                      style={{
                        top: "12px",
                        right: "12px",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        padding: "6px 12px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        borderRadius: "6px",
                        zIndex: 1,
                        letterSpacing: "0.5px",
                      }}
                    >
                      -10% OFF
                    </span>

                    <img
                      src={producto.img_url}
                      className="card-img-top mx-auto"
                      alt={producto.nombre}
                      style={{
                        height: "150px",
                        objectFit: "contain",
                        marginBottom: "15px",
                      }}
                    />

                    <div className="card-body p-0">
                      <h6 style={{ 
                        minHeight: "45px", 
                        fontSize: "0.9rem",
                        color: "#555",
                        lineHeight: "1.4",
                        marginBottom: "12px"
                      }}>
                        {producto.nombre.length > 60
                          ? producto.nombre.slice(0, 60) + "..."
                          : producto.nombre}
                      </h6>

                      <div>
                        <p className="text-decoration-line-through mb-1" style={{ 
                          fontSize: "0.85rem",
                          color: "#999"
                        }}>
                          S/ {producto.precio.toFixed(2)}
                        </p>
                        <p className="fw-bold mb-1" style={{
                          fontSize: "1.4rem",
                          color: "black",
                          marginBottom: "8px"
                        }}>
                          S/ {(producto.precio * 0.9).toFixed(2)}
                        </p>
                        <small style={{ 
                          color: "#28a745",
                          fontWeight: "500",
                          fontSize: "0.8rem"
                        }}>
                          Ahorra S/ {(producto.precio * 0.1).toFixed(2)}
                        </small>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Productos --- */}
      <section className="container-xl mt-5" style={{ padding: "40px 0" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-2" style={{ fontSize: "2rem", color: "#1a1a1a" }}>
              Nuestros Productos
            </h2>
            <div style={{ 
              width: "60px", 
              height: "4px", 
              backgroundColor: "#0d6efd", 
              borderRadius: "2px" 
            }}></div>
          </div>
          <Link
            to="/productos"
            className="text-decoration-none fw-semibold d-flex align-items-center gap-2"
            style={{ 
              fontSize: "0.95rem", 
              color: "#0d6efd",
              transition: "color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.color = "#0a58ca"}
            onMouseLeave={(e) => e.target.style.color = "#0d6efd"}
          >
            Ver todos los productos
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </Link>
        </div>

        <div className="row justify-content-center row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
          {productosNormales.map((producto) => (
            <div className="col d-flex justify-content-center" key={producto.id}>
              <Link
                to={`/producto/${producto.id}`}
                className="text-decoration-none"
                style={{ width: "100%", maxWidth: "220px" }}
              >
                <div
                  className="card border-0 text-center p-3 h-100"
                  style={{
                    transition: "all 0.3s ease",
                    fontSize: "0.9rem",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderRadius: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                >
                  <img
                    src={producto.img_url}
                    className="card-img-top mx-auto"
                    alt={producto.nombre}
                    style={{
                      height: "150px",
                      objectFit: "contain",
                      marginBottom: "15px",
                    }}
                  />

                  <div className="card-body p-0">
                    <h6 style={{ 
                      minHeight: "45px", 
                      fontSize: "0.9rem",
                      color: "#555",
                      lineHeight: "1.4",
                      marginBottom: "12px"
                    }}>
                      {producto.nombre.length > 60
                        ? producto.nombre.slice(0, 60) + "..."
                        : producto.nombre}
                    </h6>
                    <div>
                      <p className="fw-bold mb-1" style={{
                        fontSize: "1.3rem",
                        color: "#1a1a1a"
                      }}>
                        S/ {producto.precio.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de testimonios */}
      <section style={{ 
        padding: "80px 0",
        backgroundColor: "#f8f9fa",
        marginTop: "60px"
      }}>
        <div className="container-xl">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2" style={{ fontSize: "2rem", color: "#1a1a1a" }}>
              Testimonios de Clientes
            </h2>
            <div style={{ 
              width: "60px", 
              height: "4px", 
              backgroundColor: "#0d6efd", 
              borderRadius: "2px",
              margin: "0 auto"
            }}></div>
          </div>

          <div className="row justify-content-center row-cols-1 row-cols-md-3 g-4">
            {comentarios.map((c) => (
              <div className="col d-flex justify-content-center" key={c.id}>
                <div
                  className="card border-0 p-4 h-100"
                  style={{
                    maxWidth: "380px",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={c.imagen}
                      alt={c.nombre}
                      className="rounded-circle me-3"
                      style={{ 
                        width: "65px", 
                        height: "65px", 
                        objectFit: "cover",
                        border: "3px solid #f8f9fa"
                      }}
                    />
                    <div className="text-start">
                      <h6 className="fw-bold mb-1" style={{ color: "#1a1a1a" }}>
                        {c.nombre}
                      </h6>
                      <small style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                        {c.cargo}
                      </small>
                      <div style={{ marginTop: "6px" }}>
                        {[...Array(c.estrellas)].map((_, i) => (
                          <svg key={i} width="14" height="14" fill="#ffc107" viewBox="0 0 16 16" style={{ marginRight: "2px" }}>
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p
                    className="mb-0"
                    style={{ 
                      fontSize: "0.95rem", 
                      textAlign: "justify",
                      color: "#555",
                      lineHeight: "1.6"
                    }}
                  >
                    "{c.comentario}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
