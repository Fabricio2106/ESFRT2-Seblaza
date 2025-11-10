import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { AuthLayout } from "../layout/AuthLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import { Product } from "../pages/Product";
import { Entrega } from "../pages/Entrega";
import { Pago } from "../pages/Pago";
import { DetallePago } from "../pages/DetallePago";
import Contacto from "../pages/Contacto";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "producto/:id",
        element: <Product />,
      },
      {
        path: "contacto",
        element: <Contacto />,
      },
    ],
  },
  {
    path: "ingreso",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "producto/:id/entrega",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Entrega />,
      },
      {
        path: "pago",
        element: <Pago />,
      },
      {
        path: "pago/detalle",
        element: <DetallePago />,
      },
    ],
  },
]);

export default router;
