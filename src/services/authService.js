import { api } from './api'

// POST /auth/login → { accessToken, tokenType, expiresIn, usuario }
export async function iniciarSesion(correo, password) {
  const respuesta = await api.post('/auth/login', { correo, password })
  return respuesta.data
}

// POST /auth/register → crea siempre un Cliente (el rol lo decide el servidor)
export async function registrar(nombre, correo, password) {
  const respuesta = await api.post('/auth/register', { nombre, correo, password })
  return respuesta.data
}

// GET /auth/me → el usuario dueño del token (se usa al recargar la página)
export async function obtenerMiPerfil() {
  const respuesta = await api.get('/auth/me')
  return respuesta.data
}