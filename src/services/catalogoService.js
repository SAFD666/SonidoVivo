import { api } from './api'

// --- Productos ---
export async function listarProductos(filtros = {}) {
  const respuesta = await api.get('/productos', { params: filtros })
  return respuesta.data
}

export async function obtenerProducto(codigo) {
  const respuesta = await api.get('/productos/' + codigo)
  return respuesta.data
}

export async function crearProducto(dto) {
  const respuesta = await api.post('/productos', dto)
  return respuesta.data
}

export async function actualizarProducto(codigo, dto) {
  const respuesta = await api.put('/productos/' + codigo, dto)
  return respuesta.data
}

// DELETE responde 204 (sin cuerpo): el producto queda desactivado en la base
export async function eliminarProducto(codigo) {
  await api.delete('/productos/' + codigo)
}

// --- Categorías ---
export async function listarCategorias() {
  const respuesta = await api.get('/categorias')
  return respuesta.data
}

export async function crearCategoria(dto) {
  const respuesta = await api.post('/categorias', dto)
  return respuesta.data
}

export async function actualizarCategoria(id, dto) {
  const respuesta = await api.put('/categorias/' + id, dto)
  return respuesta.data
}

// --- Marcas ---
export async function listarMarcas() {
  const respuesta = await api.get('/marcas')
  return respuesta.data
}