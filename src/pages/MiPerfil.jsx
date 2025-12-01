import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { validaciones } from "../utils/validaciones";

export default function MiPerfil() {
  const { profileData, updateProfile, updateDireccion, updateFormaPago } = useProfile();
  
  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState({});
  const [seccionActiva, setSeccionActiva] = useState('personal');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar el error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name.startsWith('direccion.')) {
      const campo = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: { ...prev.direccion, [campo]: value }
      }));
    } else if (name.startsWith('formaPago.')) {
      const campo = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        formaPago: { ...prev.formaPago, [campo]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validarSeccionPersonal = () => {
    const nuevosErrores = {};
    
    const validacionNombres = validaciones.validarNombre(formData.nombres);
    if (!validacionNombres.valido) nuevosErrores.nombres = validacionNombres.mensaje;
    
    const validacionApellidos = validaciones.validarNombre(formData.apellidos);
    if (!validacionApellidos.valido) nuevosErrores.apellidos = validacionApellidos.mensaje;
    
    const validacionDNI = validaciones.validarDNI(formData.dni);
    if (!validacionDNI.valido) nuevosErrores.dni = validacionDNI.mensaje;
    
    const validacionFecha = validaciones.validarFechaNacimiento(formData.fechaNacimiento);
    if (!validacionFecha.valido) nuevosErrores.fechaNacimiento = validacionFecha.mensaje;
    
    const validacionTelefono = validaciones.validarTelefono(formData.telefono);
    if (!validacionTelefono.valido) nuevosErrores.telefono = validacionTelefono.mensaje;
    
    const validacionEmail = validaciones.validarEmail(formData.email);
    if (!validacionEmail.valido) nuevosErrores.email = validacionEmail.mensaje;
    
    return nuevosErrores;
  };

  const validarSeccionDireccion = () => {
    const nuevosErrores = {};
    
    const validacionCalle = validaciones.validarCalle(formData.direccion.calle);
    if (!validacionCalle.valido) nuevosErrores['direccion.calle'] = validacionCalle.mensaje;
    
    const validacionNumero = validaciones.validarNumero(formData.direccion.numero);
    if (!validacionNumero.valido) nuevosErrores['direccion.numero'] = validacionNumero.mensaje;
    
    const validacionDepto = validaciones.validarDepartamento(formData.direccion.departamento);
    if (!validacionDepto.valido) nuevosErrores['direccion.departamento'] = validacionDepto.mensaje;
    
    const validacionCiudad = validaciones.validarCiudad(formData.direccion.ciudad);
    if (!validacionCiudad.valido) nuevosErrores['direccion.ciudad'] = validacionCiudad.mensaje;
    
    const validacionDistrito = validaciones.validarDistrito(formData.direccion.distrito);
    if (!validacionDistrito.valido) nuevosErrores['direccion.distrito'] = validacionDistrito.mensaje;
    
    const validacionCP = validaciones.validarCodigoPostal(formData.direccion.codigoPostal);
    if (!validacionCP.valido) nuevosErrores['direccion.codigoPostal'] = validacionCP.mensaje;
    
    return nuevosErrores;
  };

  const validarSeccionPago = () => {
    const nuevosErrores = {};
    
    if (formData.formaPago.tipo === 'tarjeta') {
      const validacionNumero = validaciones.validarNumeroTarjeta(formData.formaPago.numeroTarjeta);
      if (!validacionNumero.valido) nuevosErrores['formaPago.numeroTarjeta'] = validacionNumero.mensaje;
      
      const validacionTitular = validaciones.validarNombreTitular(formData.formaPago.nombreTitular);
      if (!validacionTitular.valido) nuevosErrores['formaPago.nombreTitular'] = validacionTitular.mensaje;
      
      const validacionFecha = validaciones.validarFechaExpiracion(formData.formaPago.fechaExpiracion);
      if (!validacionFecha.valido) nuevosErrores['formaPago.fechaExpiracion'] = validacionFecha.mensaje;
      
      const validacionCVV = validaciones.validarCVV(formData.formaPago.cvv);
      if (!validacionCVV.valido) nuevosErrores['formaPago.cvv'] = validacionCVV.mensaje;
    }
    
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    
    let nuevosErrores = {};
    
    // Validar según la sección activa
    if (seccionActiva === 'personal') {
      nuevosErrores = validarSeccionPersonal();
    } else if (seccionActiva === 'direccion') {
      nuevosErrores = validarSeccionDireccion();
    } else if (seccionActiva === 'pago') {
      nuevosErrores = validarSeccionPago();
    }
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      setMensaje({ 
        tipo: 'error', 
        texto: 'Por favor, corrige los errores en el formulario' 
      });
      return;
    }
    
    // Actualizar datos en memoria según la sección
    if (seccionActiva === 'personal') {
      updateProfile({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: formData.telefono,
        email: formData.email
      });
    } else if (seccionActiva === 'direccion') {
      updateDireccion(formData.direccion);
    } else if (seccionActiva === 'pago') {
      updateFormaPago(formData.formaPago);
    }
    
    setMensaje({ 
      tipo: 'success', 
      texto: '¡Datos actualizados correctamente!' 
    });
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setMensaje({ tipo: '', texto: '' });
    }, 3000);
  };

  return (
    <div className="mi-perfil-page">
      <div className="container-xl py-5">
        <h1 className="fw-bold mb-4">Mi Perfil</h1>
        
        {/* Mensaje de confirmación/error */}
        {mensaje.texto && (
          <div className={`alert ${mensaje.tipo === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
            <i className={`bi ${mensaje.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {mensaje.texto}
            <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
          </div>
        )}
        
        {/* Tabs de navegación */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${seccionActiva === 'personal' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('personal')}
            >
              <i className="bi bi-person-fill me-2"></i>
              Datos Personales
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${seccionActiva === 'direccion' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('direccion')}
            >
              <i className="bi bi-geo-alt-fill me-2"></i>
              Dirección de Envío
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${seccionActiva === 'pago' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('pago')}
            >
              <i className="bi bi-credit-card-fill me-2"></i>
              Forma de Pago
            </button>
          </li>
          <li className="nav-item">
            <a 
              href="/mis-resenas"
              className="nav-link"
            >
              <i className="bi bi-star-fill me-2"></i>
              Opiniones
            </a>
          </li>
        </ul>

        {/* Formulario */}
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              
              {/* Sección: Datos Personales */}
              {seccionActiva === 'personal' && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nombres" className="form-label fw-semibold">
                      Nombres <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                      id="nombres"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      placeholder="Ingresa tus nombres"
                    />
                    {errors.nombres && <div className="invalid-feedback">{errors.nombres}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="apellidos" className="form-label fw-semibold">
                      Apellidos <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      placeholder="Ingresa tus apellidos"
                    />
                    {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="dni" className="form-label fw-semibold">
                      DNI <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      placeholder="12345678"
                      maxLength="8"
                    />
                    {errors.dni && <div className="invalid-feedback">{errors.dni}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="fechaNacimiento" className="form-label fw-semibold">
                      Fecha de Nacimiento <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : ''}`}
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                    />
                    {errors.fechaNacimiento && <div className="invalid-feedback">{errors.fechaNacimiento}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label fw-semibold">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="987654321"
                      maxLength="9"
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
              )}

              {/* Sección: Dirección de Envío */}
              {seccionActiva === 'direccion' && (
                <div className="row g-3">
                  <div className="col-md-8">
                    <label htmlFor="direccion.calle" className="form-label fw-semibold">
                      Calle/Avenida <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['direccion.calle'] ? 'is-invalid' : ''}`}
                      id="direccion.calle"
                      name="direccion.calle"
                      value={formData.direccion.calle}
                      onChange={handleChange}
                      placeholder="Av. Principal"
                    />
                    {errors['direccion.calle'] && <div className="invalid-feedback">{errors['direccion.calle']}</div>}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="direccion.numero" className="form-label fw-semibold">
                      Número <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['direccion.numero'] ? 'is-invalid' : ''}`}
                      id="direccion.numero"
                      name="direccion.numero"
                      value={formData.direccion.numero}
                      onChange={handleChange}
                      placeholder="123"
                    />
                    {errors['direccion.numero'] && <div className="invalid-feedback">{errors['direccion.numero']}</div>}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="direccion.departamento" className="form-label fw-semibold">
                      Departamento <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['direccion.departamento'] ? 'is-invalid' : ''}`}
                      id="direccion.departamento"
                      name="direccion.departamento"
                      value={formData.direccion.departamento}
                      onChange={handleChange}
                      placeholder="Lima"
                    />
                    {errors['direccion.departamento'] && <div className="invalid-feedback">{errors['direccion.departamento']}</div>}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="direccion.ciudad" className="form-label fw-semibold">
                      Ciudad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['direccion.ciudad'] ? 'is-invalid' : ''}`}
                      id="direccion.ciudad"
                      name="direccion.ciudad"
                      value={formData.direccion.ciudad}
                      onChange={handleChange}
                      placeholder="Lima"
                    />
                    {errors['direccion.ciudad'] && <div className="invalid-feedback">{errors['direccion.ciudad']}</div>}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="direccion.distrito" className="form-label fw-semibold">
                      Distrito <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['direccion.distrito'] ? 'is-invalid' : ''}`}
                      id="direccion.distrito"
                      name="direccion.distrito"
                      value={formData.direccion.distrito}
                      onChange={handleChange}
                      placeholder="Miraflores"
                    />
                    {errors['direccion.distrito'] && <div className="invalid-feedback">{errors['direccion.distrito']}</div>}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="direccion.codigoPostal" className="form-label fw-semibold">
                      Código Postal <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors['direccion.codigoPostal'] ? 'is-invalid' : ''}`}
                      id="direccion.codigoPostal"
                      name="direccion.codigoPostal"
                      value={formData.direccion.codigoPostal}
                      onChange={handleChange}
                      placeholder="15074"
                      maxLength="5"
                    />
                    {errors['direccion.codigoPostal'] && <div className="invalid-feedback">{errors['direccion.codigoPostal']}</div>}
                  </div>

                  <div className="col-12">
                    <label htmlFor="direccion.referencia" className="form-label fw-semibold">
                      Referencia
                    </label>
                    <textarea
                      className="form-control"
                      id="direccion.referencia"
                      name="direccion.referencia"
                      value={formData.direccion.referencia}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Ej: Al lado del parque, casa de color azul"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Sección: Forma de Pago */}
              {seccionActiva === 'pago' && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Tipo de Pago <span className="text-danger">*</span>
                    </label>
                    <div className="btn-group w-100" role="group">
                      <input
                        type="radio"
                        className="btn-check"
                        name="formaPago.tipo"
                        id="tipoTarjeta"
                        value="tarjeta"
                        checked={formData.formaPago.tipo === 'tarjeta'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="tipoTarjeta">
                        <i className="bi bi-credit-card me-2"></i>Tarjeta
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="formaPago.tipo"
                        id="tipoYape"
                        value="yape"
                        checked={formData.formaPago.tipo === 'yape'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="tipoYape">
                        <i className="bi bi-phone me-2"></i>Yape
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="formaPago.tipo"
                        id="tipoPlin"
                        value="plin"
                        checked={formData.formaPago.tipo === 'plin'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="tipoPlin">
                        <i className="bi bi-phone me-2"></i>Plin
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="formaPago.tipo"
                        id="tipoEfectivo"
                        value="efectivo"
                        checked={formData.formaPago.tipo === 'efectivo'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor="tipoEfectivo">
                        <i className="bi bi-cash me-2"></i>Efectivo
                      </label>
                    </div>
                  </div>

                  {formData.formaPago.tipo === 'tarjeta' && (
                    <>
                      <div className="col-12">
                        <label htmlFor="formaPago.numeroTarjeta" className="form-label fw-semibold">
                          Número de Tarjeta <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors['formaPago.numeroTarjeta'] ? 'is-invalid' : ''}`}
                          id="formaPago.numeroTarjeta"
                          name="formaPago.numeroTarjeta"
                          value={formData.formaPago.numeroTarjeta}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                        {errors['formaPago.numeroTarjeta'] && <div className="invalid-feedback">{errors['formaPago.numeroTarjeta']}</div>}
                      </div>

                      <div className="col-12">
                        <label htmlFor="formaPago.nombreTitular" className="form-label fw-semibold">
                          Nombre del Titular <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors['formaPago.nombreTitular'] ? 'is-invalid' : ''}`}
                          id="formaPago.nombreTitular"
                          name="formaPago.nombreTitular"
                          value={formData.formaPago.nombreTitular}
                          onChange={handleChange}
                          placeholder="Como aparece en la tarjeta"
                        />
                        {errors['formaPago.nombreTitular'] && <div className="invalid-feedback">{errors['formaPago.nombreTitular']}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="formaPago.fechaExpiracion" className="form-label fw-semibold">
                          Fecha de Expiración <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors['formaPago.fechaExpiracion'] ? 'is-invalid' : ''}`}
                          id="formaPago.fechaExpiracion"
                          name="formaPago.fechaExpiracion"
                          value={formData.formaPago.fechaExpiracion}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors['formaPago.fechaExpiracion'] && <div className="invalid-feedback">{errors['formaPago.fechaExpiracion']}</div>}
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="formaPago.cvv" className="form-label fw-semibold">
                          CVV <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors['formaPago.cvv'] ? 'is-invalid' : ''}`}
                          id="formaPago.cvv"
                          name="formaPago.cvv"
                          value={formData.formaPago.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors['formaPago.cvv'] && <div className="invalid-feedback">{errors['formaPago.cvv']}</div>}
                      </div>
                    </>
                  )}

                  {(formData.formaPago.tipo === 'yape' || formData.formaPago.tipo === 'plin') && (
                    <div className="col-12">
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        El pago se realizará al momento de confirmar tu pedido mediante {formData.formaPago.tipo === 'yape' ? 'Yape' : 'Plin'}.
                      </div>
                    </div>
                  )}

                  {formData.formaPago.tipo === 'efectivo' && (
                    <div className="col-12">
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        El pago se realizará en efectivo al momento de la entrega.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botón de guardar */}
              <div className="mt-4">
                <button type="submit" className="btn btn-custom w-100 py-3 fw-semibold">
                  <i className="bi bi-save me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
