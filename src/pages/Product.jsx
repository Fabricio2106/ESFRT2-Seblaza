import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../config/supaBaseConfig";

export const Product = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al cargar producto:", error);
        setProducto(null);
      } else {
        setProducto(data);
      }
      setLoading(false);
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "3rem", color: "#dc3545" }}></i>
        <h2 className="mt-3">Producto no encontrado</h2>
        <Link to="/" className="btn btn-custom mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Banner superior */}
      <div className="banner-container bg-light">
        <div className="container-xl py-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Inicio</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Productos</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {producto.nombre}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Detalle del producto */}
      <div className="container-xl py-5">
        <div className="row g-4">
          {/* Columna de imagen */}
          <div className="col-lg-6">
            <div className="product-image-container bg-white p-4 rounded shadow-sm text-center">
              <img
                src={producto.img_url}
                alt={producto.nombre}
                className="img-fluid"
                style={{ 
                  maxHeight: "500px", 
                  objectFit: "contain",
                  width: "100%" 
                }}
              />
            </div>
          </div>

          {/* Columna de información */}
          <div className="col-lg-6">
            <div className="product-info bg-white p-4 rounded shadow-sm">
              {/* Título */}
              <h1 className="h2 fw-bold mb-3">{producto.nombre}</h1>

              {/* Precio */}
              <div className="mb-4">
                <div className="d-flex align-items-baseline gap-3">
                  <span className="h3 fw-bold text-success mb-0">
                    S/. {parseFloat(producto.precio).toFixed(2)}
                  </span>
                  {producto.precio_anterior && (
                    <span className="text-muted text-decoration-line-through">
                      S/. {parseFloat(producto.precio_anterior).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Información del producto */}
              <div className="product-details mb-4">
                <div className="border-top pt-3">
                  <div className="row g-3">
                    {/* Marca */}
                    {producto.marca && (
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-award me-2 text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Marca</small>
                            <strong>{producto.marca}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modelo */}
                    {producto.modelo && (
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-tag me-2 text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Modelo</small>
                            <strong>{producto.modelo}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stock */}
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-box-seam me-2 text-primary"></i>
                        <div>
                          <small className="text-muted d-block">Stock</small>
                          <strong className={producto.stock > 0 ? "text-success" : "text-danger"}>
                            {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Categoría */}
                    {producto.categoria && (
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-grid me-2 text-primary"></i>
                          <div>
                            <small className="text-muted d-block">Categoría</small>
                            <strong>{producto.categoria}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Descripción</h5>
                <p className="text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
                  {producto.descripcion || "Este producto es de excelente calidad y cuenta con garantía del fabricante. Ideal para uso doméstico o profesional."}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-custom btn-lg py-3"
                  disabled={producto.stock === 0}
                >
                  <i className="bi bi-lightning-fill me-2"></i>
                  Comprar Ahora
                </button>
                
                <button 
                  className="btn btn-outline-primary btn-lg py-3"
                  disabled={producto.stock === 0}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Agregar al Carrito
                </button>
              </div>

              {/* Información adicional */}
              <div className="mt-4 p-3 bg-light rounded">
                <div className="d-flex align-items-start mb-2">
                  <i className="bi bi-truck me-2 text-success"></i>
                  <small>Envío gratis en compras mayores a S/. 100.00</small>
                </div>
                <div className="d-flex align-items-start mb-2">
                  <i className="bi bi-shield-check me-2 text-success"></i>
                  <small>Compra protegida con garantía del fabricante</small>
                </div>
                <div className="d-flex align-items-start">
                  <i className="bi bi-arrow-return-left me-2 text-success"></i>
                  <small>Devolución gratuita dentro de los primeros 30 días</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados o adicionales */}
        <div className="mt-5">
          <h3 className="fw-bold mb-4">Especificaciones Técnicas</h3>
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="border-bottom pb-2 mb-2">
                  <strong>Nombre:</strong>
                  <span className="text-muted ms-2">{producto.nombre}</span>
                </div>
              </div>
              {producto.marca && (
                <div className="col-md-6">
                  <div className="border-bottom pb-2 mb-2">
                    <strong>Marca:</strong>
                    <span className="text-muted ms-2">{producto.marca}</span>
                  </div>
                </div>
              )}
              {producto.modelo && (
                <div className="col-md-6">
                  <div className="border-bottom pb-2 mb-2">
                    <strong>Modelo:</strong>
                    <span className="text-muted ms-2">{producto.modelo}</span>
                  </div>
                </div>
              )}
              {producto.categoria && (
                <div className="col-md-6">
                  <div className="border-bottom pb-2 mb-2">
                    <strong>Categoría:</strong>
                    <span className="text-muted ms-2">{producto.categoria}</span>
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div className="border-bottom pb-2 mb-2">
                  <strong>Precio:</strong>
                  <span className="text-success fw-bold ms-2">S/. {parseFloat(producto.precio).toFixed(2)}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border-bottom pb-2 mb-2">
                  <strong>Disponibilidad:</strong>
                  <span className={`ms-2 ${producto.stock > 0 ? 'text-success' : 'text-danger'}`}>
                    {producto.stock > 0 ? `${producto.stock} unidades` : "Agotado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

