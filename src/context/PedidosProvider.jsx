import { useState, useEffect } from "react";
import { PedidosContext } from "./PedidosContext";
import { useAuth } from "../hooks/useAuth";

export const PedidosProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Cargar pedidos desde localStorage o usar array vacío
  const [pedidos, setPedidos] = useState(() => {
    const pedidosGuardados = localStorage.getItem("pedidos");
    return pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
  });

  // Guardar pedidos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  // Función para agregar un nuevo pedido
  const agregarPedido = (pedido) => {
    const nuevoPedido = {
      id: `PED-${Date.now()}`,
      fecha: new Date().toISOString(),
      estado: "en proceso",
      ...pedido
    };
    setPedidos(prev => [nuevoPedido, ...prev]);
    return nuevoPedido;
  };

  // Obtener pedido por ID
  const obtenerPedido = (pedidoId) => {
    return pedidos.find(p => p.id === pedidoId);
  };

  // Obtener pedidos ordenados por fecha (más reciente primero)
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
  const cancelarPedido = (pedidoId, motivo) => {
    setPedidos(prev => prev.map(p => 
      p.id === pedidoId 
        ? { 
            ...p, 
            estado: 'cancelado', 
            motivoCancelacion: motivo,
            fechaCancelacion: new Date().toISOString()
          }
        : p
    ));
  };

  return (
    <PedidosContext.Provider 
      value={{ 
        pedidos: obtenerPedidosOrdenados(),
        obtenerPedido,
        filtrarPorEstado,
        agregarPedido,
        cancelarPedido
      }}
    >
      {children}
    </PedidosContext.Provider>
  );
};
