import Navbar1 from "./subcomponents/Navbar";
import Navbar2 from "./subcomponents/Navbar2";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  
  // Verificar si es administrador
  const adminEmails = ['davidgarcia241296@gmail.com'];
  const isAdmin = user?.user_metadata?.rol === 'administrador' || adminEmails.includes(user?.email);

  return (
    <>
      {isAdmin ? <Navbar2 /> : <Navbar1 />}
    </>
  );
}
