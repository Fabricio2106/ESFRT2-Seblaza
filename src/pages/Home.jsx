import Carousel from "../components/subcomponents/carousel";
import { Link } from "react-router-dom";
import { comentarios } from "../data/productos";
import { useEffect, useState } from "react";
import { supabase } from "../config/supaBaseConfig";

export default function Home() {
  const [productos, setProducts] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [rangoPrecios, setRangoPrecios] = useState("Todos");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: productos, error } = await supabase
        .from("productos")
        .select("*");
      if (error) console.error("Error", error);
      else {
        setProducts(productos);
        setProductosFiltrados(productos);
      }
    };

    fetchProducts();
  }, []);

  // Función para filtrar productos
  useEffect(() => {
    let productosFiltro = [...productos];

    // Filtrar por categoría
    if (categoriaSeleccionada !== "Todos") {
      productosFiltro = productosFiltro.filter(
        (p) => p.categoria === categoriaSeleccionada
      );
    }

    // Filtrar por rango de precios
    if (rangoPrecios !== "Todos") {
      const [min, max] = rangoPrecios.split("-").map(Number);
      productosFiltro = productosFiltro.filter((p) => {
        const precio = parseFloat(p.precio);
        if (max) {
          return precio >= min && precio <= max;
        } else {
          return precio >= min;
        }
      });
    }

    setProductosFiltrados(productosFiltro);
  }, [categoriaSeleccionada, rangoPrecios, productos]);

  // Obtener categorías únicas con contadores
  const obtenerCategorias = () => {
    const categorias = {};
    productos.forEach((p) => {
      const cat = p.categoria || "Sin categoría";
      categorias[cat] = (categorias[cat] || 0) + 1;
    });
    return categorias;
  };

  // Obtener contadores por rango de precio
  const obtenerRangosPrecios = () => {
    const rangos = {
      "0-500": 0,
      "500-1000": 0,
      "1000-3000": 0,
    };

    productos.forEach((p) => {
      const precio = parseFloat(p.precio);
      if (precio <= 500) rangos["0-500"]++;
      else if (precio <= 1000) rangos["500-1000"]++;
      else if (precio <= 3000) rangos["1000-3000"]++;
    });

    return rangos;
  };

  const categorias = obtenerCategorias();
  const rangosPrecios = obtenerRangosPrecios();

  const limpiarFiltros = () => {
    setCategoriaSeleccionada("Todos");
    setRangoPrecios("Todos");
  };

  return (
    <>
      <Carousel />

      {/* --- Productos con Filtro --- */}
      <section className="container-xl mt-5">
        <div className="row">
          {/* Sidebar Filtros */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="filter-sidebar bg-white p-4 rounded shadow-sm sticky-top" style={{ top: "20px" }}>
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Filtros</h5>
                <button
                  className="btn btn-link text-decoration-none p-0"
                  style={{ fontSize: "0.9rem", color: "var(--form-btn-color)" }}
                  onClick={limpiarFiltros}
                >
                  Limpiar Filtros
                </button>
              </div>

              {/* Categorías */}
              <div className="mb-4">
                <button
                  className="btn btn-link text-dark text-decoration-none p-0 w-100 text-start d-flex justify-content-between align-items-center fw-semibold mb-3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#categoriaCollapse"
                  aria-expanded="true"
                >
                  Categoria
                  <i className="bi bi-chevron-down"></i>
                </button>
                <div className="collapse show" id="categoriaCollapse">
                  <div className="list-group list-group-flush">
                    <label
                      className="list-group-item border-0 d-flex justify-content-between align-items-center ps-0 py-2"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="categoria"
                          checked={categoriaSeleccionada === "Todos"}
                          onChange={() => setCategoriaSeleccionada("Todos")}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.95rem" }}>
                          Todos
                        </label>
                      </div>
                      <span className="badge bg-light text-dark rounded-pill">
                        {productos.length}
                      </span>
                    </label>
                    {Object.keys(categorias).map((cat) => (
                      <label
                        key={cat}
                        className="list-group-item border-0 d-flex justify-content-between align-items-center ps-0 py-2"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="categoria"
                            checked={categoriaSeleccionada === cat}
                            onChange={() => setCategoriaSeleccionada(cat)}
                          />
                          <label className="form-check-label" style={{ fontSize: "0.95rem" }}>
                            {cat}
                          </label>
                        </div>
                        <span className="badge bg-light text-dark rounded-pill">
                          {categorias[cat]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Precio */}
              <div className="mb-4">
                <button
                  className="btn btn-link text-dark text-decoration-none p-0 w-100 text-start d-flex justify-content-between align-items-center fw-semibold mb-3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#precioCollapse"
                  aria-expanded="true"
                >
                  Precios
                  <i className="bi bi-chevron-down"></i>
                </button>
                <div className="collapse show" id="precioCollapse">
                  <div className="list-group list-group-flush">
                    <label
                      className="list-group-item border-0 d-flex justify-content-between align-items-center ps-0 py-2"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="precio"
                          checked={rangoPrecios === "Todos"}
                          onChange={() => setRangoPrecios("Todos")}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.95rem" }}>
                          Todos
                        </label>
                      </div>
                      <span className="badge bg-light text-dark rounded-pill">
                        {productos.length}
                      </span>
                    </label>
                    <label
                      className="list-group-item border-0 d-flex justify-content-between align-items-center ps-0 py-2"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="precio"
                          checked={rangoPrecios === "0-500"}
                          onChange={() => setRangoPrecios("0-500")}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.95rem" }}>
                          S/0.00 - S/500.00
                        </label>
                      </div>
                      <span className="badge bg-light text-dark rounded-pill">
                        {rangosPrecios["0-500"]}
                      </span>
                    </label>
                    <label
                      className="list-group-item border-0 d-flex justify-content-between align-items-center ps-0 py-2"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="precio"
                          checked={rangoPrecios === "500-1000"}
                          onChange={() => setRangoPrecios("500-1000")}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.95rem" }}>
                          S/500.00 - S/1,000.00
                        </label>
                      </div>
                      <span className="badge bg-light text-dark rounded-pill">
                        {rangosPrecios["500-1000"]}
                      </span>
                    </label>
                    <label
                      className="list-group-item border-0 d-flex justify-content-between align-items-center ps-0 py-2"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="precio"
                          checked={rangoPrecios === "1000-3000"}
                          onChange={() => setRangoPrecios("1000-3000")}
                        />
                        <label className="form-check-label" style={{ fontSize: "0.95rem" }}>
                          S/1,000.00 - S/3,000.00
                        </label>
                      </div>
                      <span className="badge bg-light text-dark rounded-pill">
                        {rangosPrecios["1000-3000"]}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Grid de Productos */}
          <div className="col-lg-9 col-md-8">
            <div className="d-flex justify-content-end mb-3">
              <Link
                to="/productos"
                className="text-primary text-decoration-none fw-semibold"
                style={{ fontSize: "0.9rem" }}
              >
                See All New Products
              </Link>
            </div>

            {productosFiltrados.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-search" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                <p className="text-muted mt-3">No se encontraron productos con los filtros seleccionados</p>
                <button className="btn btn-custom mt-2" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {productosFiltrados.map((producto) => (
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

                          <div>
                            <p className="text-muted text-decoration-line-through mb-1">
                              S/. 499.00
                            </p>
                            <p className="fw-bold fs-6 mb-1">S/. {producto.precio}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección de nuestros clientes */}
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
