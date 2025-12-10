import { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../config/supaBaseConfig";

export default function Contacto() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Cargar datos del usuario autenticado
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error al cargar datos del usuario:', error);
          return;
        }

        if (data) {
          setFormData(prev => ({
            ...prev,
            nombre: `${data.nombres || ''} ${data.apellidos || ''}`.trim(),
            email: user.email || '',
            telefono: data.telefono || ''
          }));
        } else {
          // Si no existe perfil, solo cargar el email
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      } catch (error) {
        console.error('Error inesperado al cargar datos del usuario:', error);
      }
    };

    cargarDatosUsuario();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Preparar los datos para EmailJS
      const templateParams = {
        from_name: formData.nombre,
        from_email: formData.email,
        phone: formData.telefono,
        subject: formData.asunto,
        message: formData.mensaje,
      };

      // Enviar email usando EmailJS
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setStatus({
          type: 'success',
          message: '¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.'
        });
        
        // Resetear solo campos no protegidos
        if (user) {
          // Si está autenticado, mantener nombre, email y teléfono
          setFormData(prev => ({
            ...prev,
            asunto: "",
            mensaje: "",
          }));
        } else {
          // Si no está autenticado, resetear todo
          setFormData({
            nombre: "",
            email: "",
            telefono: "",
            asunto: "",
            mensaje: "",
          });
        }
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setStatus({
        type: 'error',
        message: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contacto-page">
      {/* Banner */}
      <div className="banner-container">
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=400&fit=crop"
          alt="Contacto Banner"
          className="banner-img"
        />
        <div
          className="position-absolute top-50 start-50 translate-middle text-white text-center"
          style={{ zIndex: 5 }}
        >
          <h1 className="display-4 fw-bold">Contáctanos</h1>
          <p className="lead">Estamos aquí para ayudarte</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-xl main-superpuesto">
        <div className="row g-4">
          {/* Información de contacto */}
          <div className="col-lg-5">
            <div className="contact-info">
              <h2 className="fw-bold mb-4">Información de Contacto</h2>
              <p className="text-muted mb-4">
                Completa el formulario y nuestro equipo se pondrá en contacto
                contigo lo antes posible.
              </p>

              <div className="mb-4">
                <div className="d-flex align-items-start mb-3">
                  <div
                    className="me-3 text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "var(--form-btn-color)",
                    }}
                  >
                    <i className="bi bi-geo-alt-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Dirección</h5>
                    <p className="text-muted mb-0">
                      Av. Principal 123, Lima, Perú
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div
                    className="me-3 text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "var(--form-btn-color)",
                    }}
                  >
                    <i className="bi bi-telephone-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Teléfono</h5>
                    <p className="text-muted mb-0">+51 999 888 777</p>
                    <p className="text-muted mb-0">+51 999 888 778</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div
                    className="me-3 text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "var(--form-btn-color)",
                    }}
                  >
                    <i className="bi bi-envelope-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Email</h5>
                    <p className="text-muted mb-0">info@tuempresa.com</p>
                    <p className="text-muted mb-0">soporte@tuempresa.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div
                    className="me-3 text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "var(--form-btn-color)",
                    }}
                  >
                    <i className="bi bi-clock-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Horario de Atención</h5>
                    <p className="text-muted mb-0">Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted mb-0">Sábados: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="mt-4">
                <h5 className="fw-bold mb-3">Síguenos</h5>
                <div className="d-flex gap-3">
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "var(--form-btn-color)" }}
                  >
                    <i className="bi bi-facebook fs-3"></i>
                  </a>
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "var(--form-btn-color)" }}
                  >
                    <i className="bi bi-instagram fs-3"></i>
                  </a>
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "var(--form-btn-color)" }}
                  >
                    <i className="bi bi-twitter fs-3"></i>
                  </a>
                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{ color: "var(--form-btn-color)" }}
                  >
                    <i className="bi bi-linkedin fs-3"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="col-lg-7">
            <div className="contact-form p-4 rounded shadow-sm bg-light">
              <h2 className="fw-bold mb-4">Envíanos un Mensaje</h2>
              
              {/* Mensajes de estado */}
              {status.message && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                  <i className={`bi ${status.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                  {status.message}
                  <button type="button" className="btn-close" onClick={() => setStatus({ type: '', message: '' })}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label fw-semibold">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      readOnly={user ? true : false}
                      placeholder="tu@email.com"
                      style={user ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}
                    />
                    {user && (
                      <small className="text-muted">El email no puede ser modificado</small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label fw-semibold">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="+51 999 888 777"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="asunto" className="form-label fw-semibold">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="mensaje" className="form-label fw-semibold">
                      Mensaje *
                    </label>
                    <textarea
                      className="form-control"
                      id="mensaje"
                      name="mensaje"
                      rows="6"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-custom w-100 py-3 fw-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i>
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Mapa (opcional) */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="fw-bold mb-4 text-center">Encuéntranos</h3>
            <div className="ratio ratio-21x9 rounded overflow-hidden shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3098616906396!2d-77.04281492411625!3d-12.046373888146195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b5d35662c7%3A0x7f7b3f4b7ec5e4d1!2sLima%2C%20Peru!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
