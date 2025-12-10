// Función para inicializar datos de prueba en localStorage
export const inicializarPedidosEjemplo = () => {
  // Crear pedidos de ejemplo con estado "entregado"
  const pedidosEjemplo = [
    {
      id: `PED-${Date.now() - 86400000}`, // 1 día atrás
      fecha: new Date(Date.now() - 86400000).toISOString(),
      estado: "entregado",
      total: 450.00,
      productos: [
        {
          id: 1,
          nombre: "Extractor de aire",
          cantidad: 1,
          precio: 450.00,
          imagen: "/src/assets/img/Bosch.jpg"
        }
      ],
      metodoPago: "Tarjeta de crédito",
      direccionEnvio: {
        calle: "Av. Principal",
        numero: "123",
        distrito: "San Isidro",
        ciudad: "Lima",
        departamento: "Lima"
      },
      fechaEntrega: new Date(Date.now() - 43200000).toISOString() // 12 horas atrás
    },
    {
      id: `PED-${Date.now() - 172800000}`, // 2 días atrás
      fecha: new Date(Date.now() - 172800000).toISOString(),
      estado: "entregado",
      total: 890.00,
      productos: [
        {
          id: 2,
          nombre: "Extractor de baño",
          cantidad: 1,
          precio: 350.00,
          imagen: "/src/assets/img/ExtractordeBaño.jpg"
        },
        {
          id: 3,
          nombre: "Termoventilador",
          cantidad: 1,
          precio: 540.00,
          imagen: "/src/assets/img/Termoventilador.jpg"
        }
      ],
      metodoPago: "Yape",
      direccionEnvio: {
        calle: "Jr. Las Flores",
        numero: "456",
        distrito: "Miraflores",
        ciudad: "Lima",
        departamento: "Lima"
      },
      fechaEntrega: new Date(Date.now() - 86400000).toISOString() // 1 día atrás
    },
    {
      id: `PED-${Date.now() - 259200000}`, // 3 días atrás
      fecha: new Date(Date.now() - 259200000).toISOString(),
      estado: "entregado",
      total: 1200.00,
      productos: [
        {
          id: 4,
          nombre: "Ventilador de Techo LED",
          cantidad: 1,
          precio: 1200.00,
          imagen: "/src/assets/img/VentiladorTecho.jpg"
        }
      ],
      metodoPago: "Plin",
      direccionEnvio: {
        calle: "Av. Larco",
        numero: "789",
        distrito: "Surco",
        ciudad: "Lima",
        departamento: "Lima"
      },
      fechaEntrega: new Date(Date.now() - 172800000).toISOString() // 2 días atrás
    }
  ];

  // Guardar en localStorage
  localStorage.setItem("pedidos", JSON.stringify(pedidosEjemplo));
  console.log("✅ Pedidos de ejemplo creados:", pedidosEjemplo.length);
  
  return pedidosEjemplo;
};

// Función para limpiar todos los pedidos (útil para testing)
export const limpiarPedidos = () => {
  localStorage.removeItem("pedidos");
  console.log("🗑️ Pedidos eliminados de localStorage");
};

// Función para agregar un pedido entregado específico
export const agregarPedidoEntregadoEjemplo = (nombreProducto, precio, imagen) => {
  const pedidosActuales = JSON.parse(localStorage.getItem("pedidos") || "[]");
  
  const nuevoPedido = {
    id: `PED-${Date.now()}`,
    fecha: new Date().toISOString(),
    estado: "entregado",
    total: precio,
    productos: [
      {
        id: Date.now(),
        nombre: nombreProducto,
        cantidad: 1,
        precio: precio,
        imagen: imagen
      }
    ],
    metodoPago: "Tarjeta de crédito",
    direccionEnvio: {
      calle: "Dirección de ejemplo",
      numero: "000",
      distrito: "Lima",
      ciudad: "Lima",
      departamento: "Lima"
    },
    fechaEntrega: new Date().toISOString()
  };
  
  pedidosActuales.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidosActuales));
  
  return nuevoPedido;
};
