import { useAuth } from "../hooks/useAuth";

export const UserProfile = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <p>Bienvenido, {user.email}</p>
      {user.user_metadata?.nombre && <p>Nombre: {user.user_metadata.nombre}</p>}
      <button onClick={handleSignOut}>Cerrar Sesión</button>
    </div>
  );
};
