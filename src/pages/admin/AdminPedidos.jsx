import { useState, useEffect } from "react";
import { supabase } from "../../config/supaBaseConfig";
import Swal from "sweetalert2";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarTodosPedidos();
  }, []);

  const cargarTodosPedidos = async () => {
    try {
      setLoading(true);
      
      // Cargar todos los pedidos con información de usuario, detalles y pagos
      // Excluir pedidos de administradores
      const { data: pedidosData, error: pedidosError } = await supabase
        .from("pedidos")
        .select(`
          *,
          perfiles!inner (
            nombres,
            apellidos,
            rol
          ),
          detalles_pedido (
            cantidad,
            precio_unitario,
            productos (
              id,
              nombre,
              img_url
            )
          ),
          pagos (
            id_metodo_pago,
            monto,
            estado_pago,
            fecha_pago,
            referencia_transaccion
          )
        `)
        .neq("perfiles.rol", "admin")
        .order("fecha_pedido", { ascending: false });

      if (pedidosError) {
        console.error("Error detallado:", pedidosError);
        throw pedidosError;
      }

      // Obtener los emails de auth.users para cada usuario
      const pedidosConEmail = await Promise.all(
        (pedidosData || []).map(async (pedido) => {
          let email = "";
          try {
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(pedido.id_usuario);
            if (!userError && userData?.user) {
              email = userData.user.email;
            }
          } catch (e) {
            // Si no se puede obtener el email del admin API, intentar desde la sesión
            console.log("No se pudo obtener email del admin API");
          }
          return { ...pedido, userEmail: email };
        })
      );

      // Transformar datos
      const pedidosTransformados = pedidosConEmail.map(pedido => {
        const productos = (pedido.detalles_pedido || []).map(detalle => ({
          id: detalle.productos.id,
          nombre: detalle.productos.nombre,
          cantidad: detalle.cantidad,
          precio: detalle.precio_unitario,
          imagen: detalle.productos.img_url
        }));

        const pago = pedido.pagos?.[0] || {};
        const direccion = typeof pedido.direccion_envio === 'string' 
          ? JSON.parse(pedido.direccion_envio) 
          : pedido.direccion_envio;

        const nombreCompleto = pedido.perfiles 
          ? `${pedido.perfiles.nombres || ''} ${pedido.perfiles.apellidos || ''}`.trim() 
          : "Cliente desconocido";

        return {
          id: pedido.id,
          fecha: pedido.fecha_pedido,
          estado: pedido.estado_pedido,
          total: pedido.total,
          cliente: nombreCompleto || "Cliente desconocido",
          email: pedido.userEmail || direccion?.email || "",
          metodoPago: obtenerNombreMetodoPago(pago.id_metodo_pago),
          direccionEnvio: direccion,
          productos: productos,
          fechaPago: pago.fecha_pago,
          referencia: pago.referencia_transaccion,
          estadoPago: pago.estado_pago
        };
      });

      setPedidos(pedidosTransformados);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los pedidos"
      });
    } finally {
      setLoading(false);
    }
  };

  const obtenerNombreMetodoPago = (idMetodo) => {
    const metodos = {
      1: "Tarjeta de crédito",
      2: "Tarjeta de débito",
      3: "PayPal",
      4: "Yape/Plin"
    };
    return metodos[idMetodo] || "No especificado";
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from("pedidos")
        .update({ estado_pedido: nuevoEstado })
        .eq("id", pedidoId);

      if (error) throw error;

      await cargarTodosPedidos();
      
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `El pedido ahora está ${nuevoEstado}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el estado del pedido"
      });
    }
  };

  const verDetallesPedido = (pedido) => {
    const productosHTML = pedido.productos.map(p => `
      <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
        <span>${p.nombre} x${p.cantidad}</span>
        <span>S/ ${(p.precio * p.cantidad).toFixed(2)}</span>
      </div>
    `).join('');

    Swal.fire({
      title: `Pedido #${pedido.id.substring(0, 8)}`,
      html: `
        <div style="text-align: left;">
          <h6><strong>Cliente:</strong></h6>
          <p>${pedido.cliente}<br/>${pedido.email}</p>
          
          <h6><strong>Dirección de envío:</strong></h6>
          <p>
            ${pedido.direccionEnvio.direccion}<br/>
            ${pedido.direccionEnvio.ciudad}, ${pedido.direccionEnvio.codigoPostal}<br/>
            Tel: ${pedido.direccionEnvio.telefono}
          </p>
          
          <h6><strong>Productos:</strong></h6>
          ${productosHTML}
          
          <div style="margin-top: 15px; padding-top: 10px; border-top: 2px solid #333;">
            <strong>Total: S/ ${pedido.total.toFixed(2)}</strong>
          </div>
          
          <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
            <p><strong>Método de pago:</strong> ${pedido.metodoPago}</p>
            <p><strong>Referencia:</strong> ${pedido.referencia}</p>
            <p><strong>Estado de pago:</strong> ${pedido.estadoPago}</p>
          </div>
        </div>
      `,
      width: 600,
      confirmButtonText: "Cerrar"
    });
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const cumpleFiltroEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    const cumpleBusqueda = busqueda === "" || 
      pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.email.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleFiltroEstado && cumpleBusqueda;
  });

  const estadisticas = {
    total: pedidos.length,
    enProceso: pedidos.filter(p => p.estado === "en proceso").length,
    enviados: pedidos.filter(p => p.estado === "enviado").length,
    entregados: pedidos.filter(p => p.estado === "entregado").length,
    cancelados: pedidos.filter(p => p.estado === "cancelado").length,
    totalVentas: pedidos.reduce((sum, p) => sum + parseFloat(p.total), 0)
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Gestión de Pedidos</h1>
        <button className="btn btn-outline-primary" onClick={cargarTodosPedidos}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-2">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">Total Pedidos</h6>
              <h3 className="card-title mb-0">{estadisticas.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-2">
          <div className="card border-0 shadow-sm bg-warning text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">En Proceso</h6>
              <h3 className="card-title mb-0">{estadisticas.enProceso}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-2">
          <div className="card border-0 shadow-sm bg-info text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">Enviados</h6>
              <h3 className="card-title mb-0">{estadisticas.enviados}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-2">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">Entregados</h6>
              <h3 className="card-title mb-0">{estadisticas.entregados}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-2">
          <div className="card border-0 shadow-sm bg-danger text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">Cancelados</h6>
              <h3 className="card-title mb-0">{estadisticas.cancelados}</h3>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-2">
          <div className="card border-0 shadow-sm bg-dark text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 opacity-75">Total Ventas</h6>
              <h3 className="card-title mb-0">S/ {estadisticas.totalVentas.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Buscar pedido</label>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por cliente, email o ID de pedido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Filtrar por estado</label>
              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="en proceso">En proceso</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {pedidosFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No se encontraron pedidos</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Método Pago</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>
                        <small className="font-monospace">
                          {pedido.id.substring(0, 8)}...
                        </small>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{pedido.cliente}</div>
                          <small className="text-muted">{pedido.email}</small>
                        </div>
                      </td>
                      <td>
                        <small>
                          {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {pedido.productos.length} {pedido.productos.length === 1 ? 'producto' : 'productos'}
                        </span>
                      </td>
                      <td>
                        <strong>S/ {parseFloat(pedido.total).toFixed(2)}</strong>
                      </td>
                      <td>
                        <small>{pedido.metodoPago}</small>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm ${
                            pedido.estado === "en proceso" ? "bg-warning bg-opacity-25" :
                            pedido.estado === "enviado" ? "bg-info bg-opacity-25" :
                            pedido.estado === "entregado" ? "bg-success bg-opacity-25" :
                            pedido.estado === "cancelado" ? "bg-danger bg-opacity-25" : ""
                          }`}
                          value={pedido.estado}
                          onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                        >
                          <option value="en proceso">En proceso</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => verDetallesPedido(pedido)}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
