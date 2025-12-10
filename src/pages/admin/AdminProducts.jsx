import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supaBaseConfig';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    modelo: '',
    marca: '',
    precio: 0.0,
    stock: 0,
    estado: 'disponible'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error de Supabase al cargar productos:', error);
        throw error;
      }
      
      console.log('Productos cargados:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProducts([]); // Asegurar que products sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos según búsqueda y filtros
  const filteredProducts = products.filter(product => {
    // Validar que el producto existe
    if (!product) return false;
    
    const matchesSearch = product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.categoria?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || product.categoria?.toLowerCase() === categoryFilter.toLowerCase();
    
    const matchesStatus = !statusFilter || product.estado === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      categoria: product.categoria || '',
      modelo: product.modelo || '',
      marca: product.marca || '',
      precio: Number(product.precio) || 0.0,
      stock: Number(product.stock) || 0,
      estado: product.estado || 'disponible'
    });
    setShowEditModal(true);
  };

  const handleOpenCreateModal = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      modelo: '',
      marca: '',
      precio: 0.0,
      stock: 0,
      estado: 'disponible'
    });
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setImageFile(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      modelo: '',
      marca: '',
      precio: 0.0,
      stock: 0,
      estado: 'disponible'
    });
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      modelo: '',
      marca: '',
      precio: 0.0,
      stock: 0,
      estado: 'disponible'
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo inválido',
          text: 'Por favor seleccione una imagen válida'
        });
        return;
      }
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo muy grande',
          text: 'La imagen no debe superar los 5MB'
        });
        return;
      }
      setImageFile(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (name === 'precio' || name === 'stock') ? Number(value) || 0 : 
              value
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Validar datos antes de enviar
      if (!formData.nombre || !formData.categoria || !formData.modelo || !formData.marca || formData.precio <= 0 || formData.stock < 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor complete todos los campos requeridos correctamente'
        });
        return;
      }

      const precioNumerico = parseFloat(formData.precio);
      const stockNumerico = parseInt(formData.stock);

      // Subir imagen si existe
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const newProductData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
        categoria: formData.categoria,
        modelo: formData.modelo.trim(),
        marca: formData.marca.trim(),
        precio: precioNumerico,
        stock: stockNumerico,
        estado: formData.estado
      };

      // Solo agregar imagen si se subió una
      if (imageUrl) {
        newProductData.img_url = imageUrl;
      }

      console.log('Creando nuevo producto:', newProductData);

      const { data, error } = await supabase
        .from('productos')
        .insert([newProductData])
        .select();

      if (error) {
        console.error('Error de Supabase al crear producto:', error);
        throw error;
      }

      console.log('Producto creado exitosamente:', data);

      // Cerrar modal
      handleCloseCreateModal();
      
      // Recargar productos
      await fetchProducts();
      
      Swal.fire({
        icon: 'success',
        title: '¡Producto creado!',
        text: 'El producto se ha creado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: error.message || 'Error desconocido'
      });
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Validar datos antes de enviar
      if (!formData.nombre || !formData.categoria || !formData.modelo || !formData.marca || formData.precio <= 0 || formData.stock < 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor complete todos los campos requeridos correctamente'
        });
        return;
      }

      const precioNumerico = parseFloat(formData.precio);
      const stockNumerico = parseInt(formData.stock);

      console.log('=== INICIO ACTUALIZACIÓN ===');
      console.log('Precio original:', formData.precio, typeof formData.precio);
      console.log('Precio parseado:', precioNumerico, typeof precioNumerico);
      console.log('Stock parseado:', stockNumerico, typeof stockNumerico);

      const updateData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
        categoria: formData.categoria,
        modelo: formData.modelo.trim(),
        marca: formData.marca.trim(),
        precio: precioNumerico,
        stock: stockNumerico,
        estado: formData.estado
      };

      console.log('Update data completo:', JSON.stringify(updateData, null, 2));
      console.log('ID del producto:', editingProduct.id);

      // Actualizar el producto
      const { data, error } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', editingProduct.id)
        .select();

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      console.log('Respuesta de Supabase:', data);

      // Cerrar modal
      handleCloseModal();
      
      // Recargar productos
      await fetchProducts();
      
      Swal.fire({
        icon: 'success',
        title: '¡Producto actualizado!',
        text: 'Los cambios se han guardado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
      console.log('=== FIN ACTUALIZACIÓN ===');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
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
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid">
        
        {/* ZONA A: Cabecera */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 mb-0 text-gray-800">Inventario de Productos</h2>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenCreateModal}>
            <span className="fs-5">+</span> Nuevo Producto
          </button>
        </div>

        {/* ZONA B: Barra de Herramientas */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body d-flex flex-wrap gap-3 align-items-center justify-content-between">
            {/* Buscador */}
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-white text-muted">🔍</span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0" 
                placeholder="Buscar producto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros */}
            <div className="d-flex gap-2">
              <select 
                className="form-select" 
                aria-label="Filtrar por categoría"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                <option value="extractor">Extractores</option>
                <option value="aire acondicionado">Aires Acondicionados</option>
              
              </select>
              <select 
                className="form-select" 
                aria-label="Filtrar por estado"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="oferta">Oferta</option>
              </select>
            </div>
          </div>
        </div>

        {/* ZONA C: Tabla de Productos */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="ps-4 py-3">Producto</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Estado</th>
                    <th scope="col" className="text-end pe-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        {products.length === 0 ? 'No hay productos registrados' : 'No se encontraron productos con los filtros aplicados'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        {/* Imagen y Nombre */}
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            {product.imagen && (
                              <img 
                                src={product.imagen} 
                                alt={product.nombre} 
                                className="rounded border" 
                                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/48?text=No+Img';
                                }}
                              />
                            )}
                            <div>
                              <div className="fw-bold text-dark">{product.nombre}</div>
                              <small className="text-muted">ID: #{product.id}</small>
                            </div>
                          </div>
                        </td>
                        
                        <td>{product.categoria || 'Sin categoría'}</td>
                        
                        <td className="fw-bold text-dark">
                          S/ {Number(product.precio || 0).toFixed(2)}
                        </td>
                        
                        {/* Stock con lógica de color */}
                        <td>
                          {!product.stock || product.stock === 0 ? (
                            <span className="text-danger fw-bold">Agotado</span>
                          ) : product.stock < 10 ? (
                            <span className="text-warning fw-bold">{product.stock} un. (Bajo)</span>
                          ) : (
                            <span className="text-success">{product.stock} un.</span>
                          )}
                        </td>

                        {/* Estado (Badge) */}
                        <td>
                          <span className={`badge rounded-pill ${product.estado === 'oferta' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-success bg-opacity-10 text-success'}`}>
                            {product.estado === 'oferta' ? 'Oferta' : 'Disponible'}
                          </span>
                        </td>

                        {/* Botones de Acción */}
                        <td className="text-end pe-4">
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-secondary border-0" 
                              title="Editar"
                              onClick={() => handleEditClick(product)}
                            >
                              ✏️
                            </button>
                           
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Footer de la Tabla (Paginación simple) */}
          <div className="card-footer bg-white border-top-0 py-3 d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Mostrando {filteredProducts.length} de {products.length} producto{products.length !== 1 ? 's' : ''}
            </small>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled"><button className="page-link">Anterior</button></li>
                <li className="page-item active"><button className="page-link">1</button></li>
                <li className="page-item"><button className="page-link">Siguiente</button></li>
              </ul>
            </nav>
          </div>

        </div>
      </div>

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Producto
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseCreateModal}></button>
              </div>
              <form onSubmit={handleCreateProduct}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Nombre */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Nombre del Producto *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Descripción */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Descripción</label>
                      <textarea
                        className="form-control"
                        name="descripcion"
                        rows="3"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    {/* Categoría */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Categoría *</label>
                      <select
                        className="form-select"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="extractor">Extractor</option>
                        <option value="aire acondicionado">Aire Acondicionado</option>
                      </select>
                    </div>

                    {/* Modelo */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Modelo *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Marca */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Marca *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="marca"
                        value={formData.marca}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Precio */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Precio (S/) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Stock */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Estado */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Estado *</label>
                      <select
                        className="form-select"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="disponible">Disponible</option>
                        <option value="oferta">Oferta</option>
                      </select>
                    </div>

                    {/* Imagen */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Imagen del Producto</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imageFile && (
                        <div className="mt-2">
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            {imageFile.name}
                          </small>
                        </div>
                      )}
                      <small className="text-muted d-block mt-1">
                        Formatos: JPG, PNG, WEBP. Tamaño máximo: 5MB
                      </small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success" disabled={uploadingImage}>
                    {uploadingImage ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Subiendo imagen...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Crear Producto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Producto
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSaveProduct}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Nombre */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Nombre del Producto *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Descripción */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Descripción</label>
                      <textarea
                        className="form-control"
                        name="descripcion"
                        rows="3"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    {/* Categoría */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Categoría *</label>
                      <select
                        className="form-select"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="extractor">Extractor</option>
                        <option value="aire acondicionado">Aire Acondicionado</option>
                        
                      </select>
                    </div>

                    {/* Modelo */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Modelo *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Marca */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Marca *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="marca"
                        value={formData.marca}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Precio */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Precio (S/) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Stock */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Estado */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Estado *</label>
                      <select
                        className="form-select"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="disponible">Disponible</option>
                        <option value="oferta">Oferta</option>
                      </select>
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
    </>
  );
};

export default AdminProducts;