// Validaciones para el formulario de perfil

export const validaciones = {
  // Validar nombres y apellidos (solo letras y espacios)
  validarNombre: (nombre) => {
    if (!nombre || nombre.trim() === "") {
      return { valido: false, mensaje: "Este campo es obligatorio" };
    }
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(nombre)) {
      return { valido: false, mensaje: "Solo se permiten letras y espacios" };
    }
    if (nombre.length < 2) {
      return { valido: false, mensaje: "Debe tener al menos 2 caracteres" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar DNI peruano (8 dígitos)
  validarDNI: (dni) => {
    if (!dni || dni.trim() === "") {
      return { valido: false, mensaje: "El DNI es obligatorio" };
    }
    const regex = /^\d{8}$/;
    if (!regex.test(dni)) {
      return { valido: false, mensaje: "El DNI debe tener 8 dígitos" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar fecha de nacimiento (mayor de 18 años)
  validarFechaNacimiento: (fecha) => {
    if (!fecha || fecha.trim() === "") {
      return { valido: false, mensaje: "La fecha de nacimiento es obligatoria" };
    }
    
    const fechaNac = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    if (edad < 18) {
      return { valido: false, mensaje: "Debes ser mayor de 18 años" };
    }
    
    if (edad > 120) {
      return { valido: false, mensaje: "Fecha inválida" };
    }
    
    return { valido: true, mensaje: "" };
  },

  // Validar teléfono peruano (9 dígitos, empieza con 9)
  validarTelefono: (telefono) => {
    if (!telefono || telefono.trim() === "") {
      return { valido: false, mensaje: "El teléfono es obligatorio" };
    }
    const regex = /^9\d{8}$/;
    if (!regex.test(telefono)) {
      return { valido: false, mensaje: "Debe tener 9 dígitos y empezar con 9" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar email
  validarEmail: (email) => {
    if (!email || email.trim() === "") {
      return { valido: false, mensaje: "El email es obligatorio" };
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return { valido: false, mensaje: "Email inválido" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar calle
  validarCalle: (calle) => {
    if (!calle || calle.trim() === "") {
      return { valido: false, mensaje: "La calle es obligatoria" };
    }
    if (calle.length < 3) {
      return { valido: false, mensaje: "Debe tener al menos 3 caracteres" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar número de dirección
  validarNumero: (numero) => {
    if (!numero || numero.trim() === "") {
      return { valido: false, mensaje: "El número es obligatorio" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar departamento
  validarDepartamento: (departamento) => {
    if (!departamento || departamento.trim() === "") {
      return { valido: false, mensaje: "El departamento es obligatorio" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar ciudad
  validarCiudad: (ciudad) => {
    if (!ciudad || ciudad.trim() === "") {
      return { valido: false, mensaje: "La ciudad es obligatoria" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar distrito
  validarDistrito: (distrito) => {
    if (!distrito || distrito.trim() === "") {
      return { valido: false, mensaje: "El distrito es obligatorio" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar código postal
  validarCodigoPostal: (codigo) => {
    if (!codigo || codigo.trim() === "") {
      return { valido: false, mensaje: "El código postal es obligatorio" };
    }
    const regex = /^\d{5}$/;
    if (!regex.test(codigo)) {
      return { valido: false, mensaje: "Debe tener 5 dígitos" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar número de tarjeta (16 dígitos)
  validarNumeroTarjeta: (numero) => {
    if (!numero || numero.trim() === "") {
      return { valido: false, mensaje: "El número de tarjeta es obligatorio" };
    }
    const numeroLimpio = numero.replace(/\s/g, '');
    const regex = /^\d{16}$/;
    if (!regex.test(numeroLimpio)) {
      return { valido: false, mensaje: "Debe tener 16 dígitos" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar nombre del titular
  validarNombreTitular: (nombre) => {
    if (!nombre || nombre.trim() === "") {
      return { valido: false, mensaje: "El nombre del titular es obligatorio" };
    }
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regex.test(nombre)) {
      return { valido: false, mensaje: "Solo se permiten letras y espacios" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar fecha de expiración (MM/YY)
  validarFechaExpiracion: (fecha) => {
    if (!fecha || fecha.trim() === "") {
      return { valido: false, mensaje: "La fecha de expiración es obligatoria" };
    }
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(fecha)) {
      return { valido: false, mensaje: "Formato inválido (MM/YY)" };
    }
    
    // Validar que no esté vencida
    const [mes, año] = fecha.split('/');
    const añoCompleto = parseInt('20' + año);
    const fechaExpiracion = new Date(añoCompleto, parseInt(mes) - 1);
    const hoy = new Date();
    
    if (fechaExpiracion < hoy) {
      return { valido: false, mensaje: "La tarjeta está vencida" };
    }
    
    return { valido: true, mensaje: "" };
  },

  // Validar CVV (3 o 4 dígitos)
  validarCVV: (cvv) => {
    if (!cvv || cvv.trim() === "") {
      return { valido: false, mensaje: "El CVV es obligatorio" };
    }
    const regex = /^\d{3,4}$/;
    if (!regex.test(cvv)) {
      return { valido: false, mensaje: "Debe tener 3 o 4 dígitos" };
    }
    return { valido: true, mensaje: "" };
  },

  // Validar campo opcional (referencia, etc.)
  validarOpcional: () => {
    return { valido: true, mensaje: "" };
  }
};
