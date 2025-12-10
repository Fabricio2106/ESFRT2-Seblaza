import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supaBaseConfig';
import Swal from 'sweetalert2';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    rol: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      
      console.log('Iniciando carga de clientes...');
      
      // Consulta directa a la tabla perfiles
      const { data, error } = await supabase
        .from('perfiles')
        .select('*');

      if (error) {
        console.error('Error al cargar clientes:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje:', error.message);
        console.error('Detalles:', error.details);
        throw error;
      }
      
      console.log('Clientes cargados exitosamente:', data);
      setClientes(data || []);
    } catch (error) {
      console.error('Error capturado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar clientes',
        html: `
          <p><strong>Mensaje:</strong> ${error.message || 'Error desconocido'}</p>
          <p><strong>Código:</strong> ${error.code || 'N/A'}</p>
          <p>Verifica las políticas RLS en Supabase.</p>
        `
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar clientes por búsqueda
  const filteredClientes = clientes.filter(cliente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.nombres?.toLowerCase().includes(searchLower) ||
      cliente.apellidos?.toLowerCase().includes(searchLower) ||
      cliente.direccion?.toLowerCase().includes(searchLower) ||
      cliente.dni?.includes(searchTerm)
    );
  });

  const handleEditClick = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombres: cliente.nombres || '',
      apellidos: cliente.apellidos || '',
      dni: cliente.dni || '',
      telefono: cliente.telefono || '',
      fecha_nacimiento: cliente.fecha_nacimiento || '',
      direccion: cliente.direccion || '',
      rol: cliente.rol || ''
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingCliente(null);
    setFormData({
      nombres: '',
      apellidos: '',
      dni: '',
      telefono: '',
      fecha_nacimiento: '',
      direccion: '',
      rol: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCliente = async (e) => {
    e.preventDefault();
    
    try {
      // Validar datos antes de enviar
      if (!formData.nombres || !formData.apellidos) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor complete los campos de nombres y apellidos'
        });
        return;
      }

      const updateData = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        dni: formData.dni?.trim() || null,
        telefono: formData.telefono?.trim() || null,
        fecha_nacimiento: formData.fecha_nacimiento || null
      };

      const { error } = await supabase
        .from('perfiles')
        .update(updateData)
        .eq('id', editingCliente.id);

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      handleCloseModal();
      await fetchClientes();
      
      Swal.fire({
        icon: 'success',
        title: '¡Cliente actualizado!',
        text: 'Los datos se han guardado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.message || 'Error desconocido'
      });
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Gestión de Clientes</h2>
          <p className="text-muted mb-0">Administra la información de tus clientes</p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, dirección o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                Total de clientes: <strong>{filteredClientes.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Rol</th>
                  <th>Dirección</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Fecha Nacimiento</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                      <p className="mb-0 mt-2">No se encontraron clientes</p>
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>
                        <small className="text-muted">#{cliente.id.slice(0, 8)}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
                               style={{ width: '35px', height: '35px' }}>
                            <i className="bi bi-person text-primary"></i>
                          </div>
                          <span>{cliente.nombres || '-'}</span>
                        </div>
                      </td>
                      <td>{cliente.apellidos || '-'}</td>
                      <td>
                        <span className={`badge ${cliente.rol === 'administrador' ? 'bg-danger' : 'bg-primary'}`}>
                          {cliente.rol || 'cliente'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {cliente.direccion || '-'}
                        </small>
                      </td>
                      <td>{cliente.dni || '-'}</td>
                      <td>
                        {cliente.telefono ? (
                          <span>
                            <i className="bi bi-phone me-1"></i>
                            {cliente.telefono}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {cliente.fecha_nacimiento ? (
                          new Date(cliente.fecha_nacimiento).toLocaleDateString('es-PE')
                        ) : '-'}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditClick(cliente)}
                          title="Editar cliente"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Cliente
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSaveCliente}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Rol (Solo lectura) */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Rol</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.rol || 'cliente'}
                        disabled
                        readOnly
                      />
                      <small className="text-muted">El rol no puede ser modificado desde aquí</small>
                    </div>

                    {/* Dirección (Solo lectura) */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Dirección</label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        value={formData.direccion}
                        disabled
                        readOnly
                      />
                      <small className="text-muted">La dirección no puede ser modificada desde aquí</small>
                    </div>

                    {/* Nombres */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Nombres *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Apellidos */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Apellidos *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* DNI */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">DNI</label>
                      <input
                        type="text"
                        className="form-control"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        maxLength="8"
                        placeholder="12345678"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        maxLength="9"
                        placeholder="987654321"
                      />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientes;
