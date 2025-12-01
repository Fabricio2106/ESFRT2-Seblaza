import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { AuthLayout } from "../layout/AuthLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import { Product } from "../pages/Product";
import { Entrega } from "../pages/Entrega";
import Pago from "../pages/Pago";
//import { DetallePago } from "../pages/DetallePago";
import Contacto from "../pages/Contacto";
import Registro from "../pages/Registro";
import ComprarAhora from "../pages/ComprarAhora";
import Carrito from "../pages/Carrito";
import MiPerfil from "../pages/MiPerfil";
import MisPedidos from "../pages/MisPedidos";
import MisResenas from "../pages/MisResenas";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "producto/:id", element: <Product /> },
      { path: "producto/:id/comprar", element: <ComprarAhora /> },
      { path: "producto/:id/pago", element: <Pago /> },
      { path: "carrito", element: <Carrito /> },
      { path: "carrito/pago", element: <Pago /> },
      { path: "contacto", element: <Contacto /> },
      { 
        path: "mi-perfil", 
        element: (
          <ProtectedRoute>
            <MiPerfil />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "mis-pedidos", 
        element: (
          <ProtectedRoute>
            <MisPedidos />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "mis-resenas", 
        element: (
          <ProtectedRoute>
            <MisResenas />
          </ProtectedRoute>
        ) 
      },
    ],
  },
  {
    path: "ingreso",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "registro", element: <Registro /> },
    ],
  },
  {
    path: "producto/:id/entrega",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Entrega /> },
      //{ path: "pago", element: <Pago /> },
      //{ path: "pago/detalle", element: <DetallePago /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;