import { useState, useEffect } from "react";
import { PedidosContext } from "./PedidosContext";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../config/supaBaseConfig";

export const PedidosProvider = ({ children }) => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos desde Supabase cuando el usuario cambie
  useEffect(() => {
    if (user?.id) {
      cargarPedidos();
    } else {
      setPedidos([]);
      setLoading(false);
    }
  }, [user?.id]);

  // Helper para obtener el nombre del método de pago
  const obtenerNombreMetodoPago = (idMetodo) => {
    const metodos = {
      1: "Tarjeta de crédito",
      2: "Tarjeta de débito",
      3: "PayPal",
      4: "Yape/Plin"
    };
    return metodos[idMetodo] || "No especificado";
  };

  // Función para inicializar métodos de pago si no existen
  const inicializarMetodosPago = async () => {
    try {
      const metodos = [
        { id: 1, nombre: "Tarjeta de crédito" },
        { id: 2, nombre: "Tarjeta de débito" },
        { id: 3, nombre: "PayPal" },
        { id: 4, nombre: "Yape/Plin" }
      ];

      for (const metodo of metodos) {
        const { data, error } = await supabase
          .from("metodos_pago")
          .select("id")
          .eq("id", metodo.id)
          .maybeSingle();

        if (!data) {
          await supabase
            .from("metodos_pago")
            .insert([metodo]);
        }
      }
    } catch (error) {
      console.error("Error al inicializar métodos de pago:", error);
    }
  };

  // Función para cargar pedidos desde Supabase
  const cargarPedidos = async () => {
    try {
      setLoading(true);
      
      // Cargar pedidos con detalles y pagos
      const { data: pedidosData, error: pedidosError } = await supabase
        .from("pedidos")
        .select(`
          *,
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
        .eq("id_usuario", user.id)
        .order("fecha_pedido", { ascending: false });

      if (pedidosError) throw pedidosError;

      // Transformar datos al formato esperado
      const pedidosTransformados = (pedidosData || []).map(pedido => {
        const productos = (pedido.detalles_pedido || []).map(detalle => ({
          id: detalle.productos.id,
          nombre: detalle.productos.nombre,
          cantidad: detalle.cantidad,
          precio: detalle.precio_unitario,
          imagen: detalle.productos.img_url
        }));

        const pago = pedido.pagos?.[0] || {};

        return {
          id: pedido.id,
          fecha: pedido.fecha_pedido,
          estado: pedido.estado_pedido,
          total: pedido.total,
          metodoPago: obtenerNombreMetodoPago(pago.id_metodo_pago),
          direccionEnvio: typeof pedido.direccion_envio === 'string' 
            ? JSON.parse(pedido.direccion_envio) 
            : pedido.direccion_envio,
          productos: productos,
          fechaPago: pago.fecha_pago,
          referencia: pago.referencia_transaccion,
          estadoPago: pago.estado_pago
        };
      });

      setPedidos(pedidosTransformados);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo pedido
  const agregarPedido = async (pedido) => {
    try {
      // Validar que el usuario esté autenticado
      if (!user?.id) {
        throw new Error("Usuario no autenticado");
      }

      console.log("Creando pedido con datos:", pedido);
      console.log("Usuario ID:", user.id);
      
      // 0. Verificar/crear métodos de pago si no existen
      await inicializarMetodosPago();
      
      // 1. Primero crear el pedido en la tabla 'pedidos'
      const nuevoPedido = {
        id_usuario: user.id,
        fecha_pedido: new Date().toISOString(),
        estado_pedido: "en proceso",
        total: pedido.total,
        direccion_envio: JSON.stringify(pedido.direccionEnvio)
      };

      console.log("Insertando pedido:", nuevoPedido);

      const { data: pedidoCreado, error: errorPedido } = await supabase
        .from("pedidos")
        .insert([nuevoPedido])
        .select()
        .single();

      if (errorPedido) {
        console.error("Error al insertar pedido:", errorPedido);
        throw errorPedido;
      }

      console.log("Pedido creado:", pedidoCreado);

      // 2. Crear el registro de pago en la tabla 'pagos'
      const nuevoPago = {
        id_pedido: pedidoCreado.id,
        id_metodo_pago: getMetodoPagoId(pedido.metodoPago),
        monto: pedido.total,
        estado_pago: "completado",
        fecha_pago: new Date().toISOString(),
        referencia_transaccion: `TXN-${Date.now()}`
      };

      console.log("Insertando pago:", nuevoPago);

      const { error: errorPago } = await supabase
        .from("pagos")
        .insert([nuevoPago]);

      if (errorPago) {
        console.error("Error al insertar pago:", errorPago);
        throw errorPago;
      }

      // 3. Insertar los detalles del pedido en 'detalles_pedido'
      const detalles = pedido.productos.map(producto => ({
        id_pedido: pedidoCreado.id,
        id_producto: producto.id,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio
      }));

      console.log("Insertando detalles:", detalles);

      const { error: errorDetalles } = await supabase
        .from("detalles_pedido")
        .insert(detalles);

      if (errorDetalles) {
        console.error("Error al insertar detalles:", errorDetalles);
        throw errorDetalles;
      }

      // Recargar pedidos
      await cargarPedidos();
      return pedidoCreado;
    } catch (error) {
      console.error("Error al crear pedido:", error);
      console.error("Detalles del error:", JSON.stringify(error, null, 2));
      throw error;
    }
  };

  // Helper para obtener el ID del método de pago
  const getMetodoPagoId = (metodoPago) => {
    const metodos = {
      "Tarjeta de crédito": 1,
      "Tarjeta de débito": 2,
      "PayPal": 3,
      "Yape/Plin": 4
    };
    return metodos[metodoPago] || 1;
  };

  // Obtener pedido por ID
  const obtenerPedido = (id) => {
    return pedidos.find(p => p.id === id);
  };

  // Obtener pedidos ordenados por fecha
  const obtenerPedidosOrdenados = () => {
    return [...pedidos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  // Filtrar pedidos por estado
  const filtrarPorEstado = (estado) => {
    if (estado === 'todos') return obtenerPedidosOrdenados();
    return pedidos.filter(p => p.estado === estado)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  // Cancelar pedido
  const cancelarPedido = async (pedidoId, motivo) => {
    try {
      const { error } = await supabase
        .from("pedidos")
        .update({ 
          estado_pedido: 'cancelado'
        })
        .eq('id', pedidoId);

      if (error) throw error;
      
      // También actualizar el estado del pago
      const { error: errorPago } = await supabase
        .from("pagos")
        .update({ 
          estado_pago: 'cancelado'
        })
        .eq('id_pedido', pedidoId);

      if (errorPago) console.error("Error al actualizar pago:", errorPago);
      
      await cargarPedidos();
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
      throw error;
    }
  };

  return (
    <PedidosContext.Provider 
      value={{ 
        pedidos: obtenerPedidosOrdenados(),
        loading,
        obtenerPedido,
        filtrarPorEstado,
        agregarPedido,
        cancelarPedido,
        cargarPedidos
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
};
