import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../config/supaBaseConfig";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión actual al cargar
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error al obtener la sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup: cancelar la suscripción cuando el componente se desmonte
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Función para iniciar sesión con email y contraseña
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return { data: null, error };
    }
  };

  // Función para registrarse con email y contraseña
  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata, // Datos adicionales del usuario (nombre, etc.)
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error al registrarse:", error);
      return { data: null, error };
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      setUser(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return { error };
    }
  };

  // Función para recuperar contraseña
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      return { data: null, error };
    }
  };

  // Función para actualizar el perfil del usuario
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
