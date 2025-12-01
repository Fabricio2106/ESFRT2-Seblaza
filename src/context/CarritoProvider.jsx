import { useState, useEffect } from "react";
import { CarritoContext } from "./CarritoContext";
import Swal from "sweetalert2";

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    // Cargar el carrito desde localStorage al iniciar
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      // Si ya existe, aumentar la cantidad
      const nuevaCantidad = productoExistente.cantidad + cantidad;
      
      if (nuevaCantidad > producto.stock) {
        Swal.fire({
          icon: "warning",
          title: "Stock insuficiente",
          text: `Solo hay ${producto.stock} unidades disponibles`,
          timer: 2000,
        });
        return;
      }

      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        )
      );
    } else {
      // Si no existe, agregarlo
      setCarrito([...carrito, { ...producto, cantidad }]);
    }

    Swal.fire({
      icon: "success",
      title: "¡Producto agregado!",
      text: `${producto.nombre} se agregó al carrito`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const producto = carrito.find((item) => item.id === id);
    if (nuevaCantidad > producto.stock) {
      Swal.fire({
        icon: "warning",
        title: "Stock insuficiente",
        text: `Solo hay ${producto.stock} unidades disponibles`,
        timer: 2000,
      });
      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const obtenerTotal = () => {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const obtenerCantidadTotal = () => {
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
  };

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    obtenerTotal,
    obtenerCantidadTotal,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
