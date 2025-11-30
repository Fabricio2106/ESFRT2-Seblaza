import { useState, useEffect } from "react";
import { PedidosContext } from "./PedidosContext";
import { useAuth } from "../hooks/useAuth";

// Pedidos simulados de ejemplo con productos reales
const pedidosIniciales = [
  {
    id: "PED-001",
    fecha: "2025-11-25T10:30:00",
    estado: "entregado",
    total: 3225.00,
    productos: [
      {
        id: 1,
        nombre: "Ventilador de Techo LED",
        cantidad: 1,
        precio: 1200.00,
        imagen: "/productos/ventilador-industrial.jpg"
      },
      {
        id: 2,
        nombre: "Aire Acondicionado Mini Split inverter",
        cantidad: 1,
        precio: 2025.00,
        imagen: "/productos/aire-split.jpg"
      }
    ],
    direccionEnvio: {
      calle: "Av. Principal",
      numero: "123",
      distrito: "Miraflores",
      ciudad: "Lima",
      departamento: "Lima"
    },
    metodoPago: "Tarjeta de crédito",
    fechaEntrega: "2025-11-27T14:00:00"
  },
  {
    id: "PED-002",
    fecha: "2025-11-20T15:45:00",
    estado: "enviado",
    total: 1600.00,
    productos: [
      {
        id: 3,
        nombre: "Extractor de baÑo inteligente y autonomo" ,
        cantidad: 2,
        precio: 800.00,
        imagen: "/productos/ventilador-techo.jpg"
      }
    ],
   direccionEnvio: {
      calle: "Av. Principal",
      numero: "123",
      distrito: "Miraflores",
      ciudad: "Lima",
      departamento: "Lima"
    },
    metodoPago: "Yape",
    fechaEstimadaEntrega: "2025-11-30T16:00:00"
  },
  {
    id: "PED-003",
    fecha: "2025-11-15T09:20:00",
    estado: "en proceso",
    total: 340.00,
    productos: [
      {
        id: 4,
        nombre: "Extractor de aire de pared",
        cantidad: 1,
        precio: 100.00,
        imagen: "/productos/aire-portatil.jpg"
      },
      {
        id: 5,
        nombre: "TermoVentilador de Pared",
        cantidad: 1,
        precio: 240.00,
        imagen: "/productos/ventilador-pedestal.jpg"
      }
    ],
    direccionEnvio: {
      calle: "Av. Principal",
      numero: "123",
      distrito: "Miraflores",
      ciudad: "Lima",
      departamento: "Lima"
    },
    metodoPago: "Plin",
    fechaEstimadaEntrega: "2025-12-02T18:00:00"
  },
  {
    id: "PED-004",
    fecha: "2025-11-10T11:00:00",
    estado: "cancelado",
    total: 390.00,
    productos: [
      {
        id: 6,
        nombre: "Extractor de Aire para Baño",
        cantidad: 1,
        precio: 390.00,
        imagen: "/productos/ventilador-mesa.jpg"
      }
    ],
    direccionEnvio: {
      calle: "Av. Principal",
      numero: "123",
      distrito: "Miraflores",
      ciudad: "Lima",
      departamento: "Lima"
    },
    metodoPago: "Efectivo",
    motivoCancelacion: "Solicitado por el cliente",
    fechaCancelacion: "2025-11-11T10:00:00"
  }
];

export const PedidosProvider = ({ children }) => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  // Cargar pedidos cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      // Simular que estos pedidos pertenecen al usuario autenticado
      setPedidos(pedidosIniciales);
    } else {
      setPedidos([]);
    }
  }, [user]);

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

  // Agregar nuevo pedido (para futuras compras)
  const agregarPedido = (nuevoPedido) => {
    const pedido = {
      ...nuevoPedido,
      id: `PED-${String(pedidos.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString(),
      estado: 'en proceso'
    };
    setPedidos(prev => [pedido, ...prev]);
    return pedido;
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
