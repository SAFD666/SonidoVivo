import { api } from './api'

// Opciones del checkout: { tiposEntrega, metodosPago, estados }
export async function obtenerOpciones() {
  const respuesta = await api.get('/pedidos/opciones')
  return respuesta.data
}

// Regiones con sus comunas: [{ id, nombre, comunas: [{ id, nombre }] }]
export async function listarRegiones() {
  const respuesta = await api.get('/regiones')
  return respuesta.data
}

// Cliente: solo sus pedidos. Administrador/Vendedor: todos.
export async function listarPedidos() {
  const respuesta = await api.get('/pedidos')
  return respuesta.data
}

// POST: recibe el DTO de entrada y devuelve el pedido creado (con su código PED-xxxx)
export async function crearPedido(dto) {
  const respuesta = await api.post('/pedidos', dto)
  return respuesta.data
}

export async function cambiarEstado(codigo, estado) {
  const respuesta = await api.patch('/pedidos/' + codigo + '/estado', { estado })
  return respuesta.data
}