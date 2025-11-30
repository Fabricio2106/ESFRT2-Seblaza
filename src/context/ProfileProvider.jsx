import { useState } from "react";
import { ProfileContext } from "./ProfileContext";

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // Datos personales
    nombres: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    
    // Dirección de envío
    direccion: {
      calle: "",
      numero: "",
      departamento: "",
      ciudad: "",
      distrito: "",
      codigoPostal: "",
      referencia: ""
    },
    
    // Forma de pago
    formaPago: {
      tipo: "", // 'tarjeta', 'yape', 'plin', 'efectivo'
      numeroTarjeta: "",
      nombreTitular: "",
      fechaExpiracion: "",
      cvv: ""
    }
  });

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
    setProfileData({
      nombres: "",
      apellidos: "",
      dni: "",
      fechaNacimiento: "",
      telefono: "",
      email: "",
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
    });
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
