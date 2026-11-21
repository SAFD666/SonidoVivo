import { api } from './api'

// Solo Administrador
export async function listarUsuarios() {
  const respuesta = await api.get('/usuarios')
  return respuesta.data
}

// Solo Administrador: { nombre, correo, password, rol, activo }
export async function crearUsuario(dto) {
  const respuesta = await api.post('/usuarios', dto)
  return respuesta.data
}

// Administrador (cualquiera) o el propio usuario (sin cambiar rol ni estado)
export async function actualizarUsuario(id, dto) {
  const respuesta = await api.put('/usuarios/' + id, dto)
  return respuesta.data
}