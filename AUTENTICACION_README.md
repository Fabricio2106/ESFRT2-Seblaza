# 🔐 Sistema de Autenticación con Supabase

Este proyecto incluye un sistema completo de autenticación usando Supabase y React Context API.

## 📁 Estructura de Archivos Creados

```
src/
├── context/
│   ├── AuthContext.jsx       # Definición del contexto
│   └── AuthProvider.jsx      # Proveedor del contexto con lógica
├── hooks/
│   └── useAuth.js            # Hook personalizado para usar el contexto
├── components/
│   ├── ProtectedRoute.jsx    # Componente para proteger rutas
│   └── UserProfile.jsx       # Componente de ejemplo para mostrar usuario
└── pages/
    ├── Login.jsx             # Página de inicio de sesión (actualizada)
    ├── Login_new.jsx         # Nueva versión de Login
    └── Registro.jsx          # Página de registro (actualizada)
```

## 🚀 Cómo Usar el Contexto de Autenticación

### 1. El contexto ya está configurado globalmente

En `main.jsx`, la aplicación ya está envuelta con el `AuthProvider`:

```jsx
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

### 2. Usar el hook `useAuth` en cualquier componente

```jsx
import { useAuth } from "../hooks/useAuth";

function MiComponente() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <p>No has iniciado sesión</p>;
  }

  return (
    <div>
      <p>Bienvenido: {user.email}</p>
      <button onClick={signOut}>Cerrar Sesión</button>
    </div>
  );
}
```

### 3. Datos Disponibles en el Contexto

El hook `useAuth()` te proporciona:

- **`user`**: Objeto del usuario actual (null si no está autenticado)
- **`session`**: Sesión actual de Supabase
- **`loading`**: Boolean que indica si está cargando
- **`signIn(email, password)`**: Función para iniciar sesión
- **`signUp(email, password, metadata)`**: Función para registrarse
- **`signOut()`**: Función para cerrar sesión
- **`resetPassword(email)`**: Función para recuperar contraseña
- **`updateProfile(updates)`**: Función para actualizar perfil

### 4. Ejemplo: Iniciar Sesión

```jsx
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await signIn(email, password);
    
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Usuario logueado:", data);
    }
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

### 5. Ejemplo: Registrarse

```jsx
import { useAuth } from "../hooks/useAuth";

function Registro() {
  const { signUp } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await signUp(email, password, {
      nombre: "Juan Pérez",
      telefono: "123456789"
    });
    
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Usuario registrado:", data);
    }
  };

  return <form onSubmit={handleRegister}>...</form>;
}
```

### 6. Proteger Rutas

Usa el componente `ProtectedRoute` para rutas que requieren autenticación:

```jsx
import { ProtectedRoute } from "../components/ProtectedRoute";

// En tu router
{
  path: "/perfil",
  element: (
    <ProtectedRoute>
      <Perfil />
    </ProtectedRoute>
  )
}
```

### 7. Acceder a Datos del Usuario

```jsx
import { useAuth } from "../hooks/useAuth";

function Perfil() {
  const { user } = useAuth();

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      <p>Nombre: {user.user_metadata?.nombre}</p>
      <p>Teléfono: {user.user_metadata?.telefono}</p>
    </div>
  );
}
```

### 8. Cerrar Sesión

```jsx
import { useAuth } from "../hooks/useAuth";

function Header() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      // Redireccionar o mostrar mensaje
    }
  };

  return (
    <nav>
      {user && (
        <button onClick={handleLogout}>Cerrar Sesión</button>
      )}
    </nav>
  );
}
```

## 🔧 Características Implementadas

✅ Autenticación persistente (se mantiene al recargar la página)
✅ Renovación automática de tokens
✅ Inicio de sesión con email y contraseña
✅ Registro de usuarios
✅ Cierre de sesión
✅ Recuperación de contraseña
✅ Actualización de perfil
✅ Protección de rutas
✅ Estado de carga
✅ Metadata de usuario personalizada

## 📝 Notas Importantes

1. **Variables de Entorno**: Asegúrate de tener configuradas las variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANN_KEY`

2. **Confirmación de Email**: Por defecto, Supabase requiere confirmación de email. Puedes desactivarlo en la configuración de Supabase si es necesario.

3. **Metadata del Usuario**: Puedes guardar datos adicionales al registrarse:
   ```jsx
   signUp(email, password, {
     nombre: "Juan",
     apellido: "Pérez",
     edad: 25
   })
   ```

4. **Persistencia**: La sesión se guarda automáticamente en localStorage y se recupera al recargar la página.

## 🎯 Próximos Pasos

1. Reemplaza el contenido de `Login.jsx` con el de `Login_new.jsx`
2. Implementa el componente `UserProfile` en tu navbar
3. Protege las rutas necesarias con `ProtectedRoute`
4. Personaliza los mensajes de SweetAlert2 según tu diseño

## 💡 Ejemplo Completo en un Componente

```jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user.email}</p>
      <button onClick={signOut}>Cerrar Sesión</button>
    </div>
  );
}
```

---

¡Tu sistema de autenticación está listo para usar! 🎉
