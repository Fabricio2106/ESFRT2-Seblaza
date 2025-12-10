import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está autenticado y es administrador
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Lista de emails de administradores autorizados
  const adminEmails = ['davidgarcia241296@gmail.com'];
  
  // Verificar si es admin por email o por rol en metadata
  const isAdmin = user.user_metadata?.rol === 'administrador' || adminEmails.includes(user.email);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
