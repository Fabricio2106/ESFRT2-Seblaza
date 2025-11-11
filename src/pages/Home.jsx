import Carousel from "../components/subcomponents/carousel";
import { Link } from "react-router-dom";
import { comentarios } from "../data/productos";
import { useEffect, useState } from "react";
import { supabase } from "../config/supaBaseConfig";

export default function Home() {
   const [productos, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productos, error } = await supabase
        .from("productos")
        .select("*");
      if (error) console.error("Error", error);
      else setProducts(productos);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Carousel />

      {/* --- Productos --- */}
      <section className="container-xl mt-5">
        <div className="d-flex justify-content-end mb-3">
          <Link
            to="/productos"
            className="text-primary text-decoration-none fw-semibold"
            style={{ fontSize: "0.9rem" }}
          >
            See All New Products
          </Link>
        </div>

        <div className="row justify-content-center row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
          {productos.map((producto) => (
            <div className="col d-flex justify-content-center" key={producto.id}>
              <Link
                to={`/producto/${producto.id}`}
                className="text-decoration-none text-dark"
                style={{ width: "200px" }}
              >
                <div
                  className="card shadow-sm border-0 text-center p-2 h-100"
                  style={{
                    transition: "0.3s",
                    fontSize: "0.9rem",
                  }}
                >
                  <img
                    src={producto.img_url}
                    className="card-img-top mx-auto"
                    alt={producto.nombre}
                    style={{
                      height: "140px",
                      objectFit: "contain",
                      marginBottom: "10px",
                    }}
                  />

                  <div className="card-body p-0">
                    <h6 className="text-muted mb-1" style={{ minHeight: "40px" }}>
                      {producto.nombre.length > 60
                        ? producto.nombre.slice(0, 60) + "..."
                        : producto.nombre}
                    </h6>
                        {/*
                        
                        
                    <div
                      style={{
                        color: "#FFD700",
                        fontSize: "0.9rem",
                        marginBottom: "4px",
                      }}
                    >
                      {[...Array(producto.estrellas)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                      <span
                        className="text-muted ms-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        (4)
                      </span>
                    </div>
                */ }
                    <div>
                      <p className="text-muted text-decoration-line-through mb-1">
                        S/. 499.00
                      </p>
                      <p className="fw-bold fs-6 mb-1">S/. 499.00</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

       Sección de nuestros clientes  
      <section className="container-xl mt-5 mb-5">
        <h2 className="fw-bold text-center mb-5" style={{ fontSize: "2rem" }}>
          De <span className="text-dark">nuestros Clientes</span>
        </h2>

        <div className="row justify-content-center row-cols-1 row-cols-md-3 g-4">
          {comentarios.map((c) => (
            <div className="col d-flex justify-content-center" key={c.id}>
              <div
                className="card shadow-sm border-0 p-4 position-relative"
                style={{
                  maxWidth: "350px",
                  minHeight: "330px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={c.imagen}
                    alt={c.nombre}
                    className="rounded-circle me-3"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                  <div className="text-start">
                    <h6 className="fw-bold mb-0">{c.nombre}</h6>
                    <small className="text-muted">{c.cargo}</small>
                    <div style={{ color: "#FFD700", fontSize: "0.9rem" }}>
                      {[...Array(c.estrellas)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>

                <p
                  className="text-muted mb-0"
                  style={{ fontSize: "0.95rem", textAlign: "justify" }}
                >
                  {c.comentario}
                </p>

                {/* Comillas decorativas */}
                <div
                  className="position-absolute"
                  style={{
                    bottom: "10px",
                    right: "15px",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: c.colorCita || "#E63946",
                  }}
                >
                  {c.id % 2 === 0 ? "”" : "“"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </>
  );
}
