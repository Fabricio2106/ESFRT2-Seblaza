import { useState, useEffect } from "react";
import { ProfileContext } from "./ProfileContext";

const STORAGE_KEY = "seblaza_profile_data";

const getInitialProfileData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Error al cargar datos del perfil desde localStorage:", error);
  }
  
  // Datos por defecto si no hay nada en localStorage
  return {
    nombres: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    direccionTexto: "",
    rol: "cliente",
    direccion: {
      calle: "",
      numero: "",
      departamento: "",
      ciudad: "",
      distrito: "",
      codigoPostal: "",
      referencia: ""
    },
    formaPago: {
      tipo: "",
      numeroTarjeta: "",
      nombreTitular: "",
      fechaExpiracion: "",
      cvv: ""
    }
  };
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(getInitialProfileData);

  // Guardar en localStorage cada vez que cambian los datos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    } catch (error) {
      console.error("Error al guardar datos del perfil en localStorage:", error);
    }
  }, [profileData]);

  const updateProfile = (newData) => {
    setProfileData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const updateDireccion = (newDireccion) => {
    setProfileData(prevData => ({
      ...prevData,
      direccion: {
        ...prevData.direccion,
        ...newDireccion
      }
    }));
  };

  const updateFormaPago = (newFormaPago) => {
    setProfileData(prevData => ({
      ...prevData,
      formaPago: {
        ...prevData.formaPago,
        ...newFormaPago
      }
    }));
  };

  const resetProfile = () => {
    const emptyProfile = {
      nombres: "",
      apellidos: "",
      dni: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
      direccionTexto: "",
      rol: "cliente",
      direccion: {
        calle: "",
        numero: "",
        departamento: "",
        ciudad: "",
        distrito: "",
        codigoPostal: "",
        referencia: ""
      },
      formaPago: {
        tipo: "",
        numeroTarjeta: "",
        nombreTitular: "",
        fechaExpiracion: "",
        cvv: ""
      }
    };
    setProfileData(emptyProfile);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error al limpiar datos del perfil en localStorage:", error);
    }
  };

  return (
    <ProfileContext.Provider 
      value={{ 
        profileData, 
        updateProfile, 
        updateDireccion, 
        updateFormaPago,
        resetProfile 
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
