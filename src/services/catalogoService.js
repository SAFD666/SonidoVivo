import { api } from './api'

// Productos: filtros opcionales { categoria, oferta, q }
export async function listarProductos(filtros = {}) {
  const respuesta = await api.get('/productos', { params: filtros })
  return respuesta.data
}

export async function obtenerProducto(codigo) {
  const respuesta = await api.get('/productos/' + codigo)
  return respuesta.data
}

export async function listarCategorias() {
  const respuesta = await api.get('/categorias')
  return respuesta.data
}

export async function listarMarcas() {
  const respuesta = await api.get('/marcas')
  return respuesta.data
}