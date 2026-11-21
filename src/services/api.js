import axios from 'axios'

// Instancia única de Axios: dirección base y tiempo máximo de espera (Guía 20).
// '/api/v1' pasa por el proxy de Vite hacia el backend del mismo EC2 (puerto 8080).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
})

// Sesión: el token JWT se guarda en sessionStorage para que la sesión siga al RECARGAR la página
// (EP3, IE3.3.2). Se borra solo al cerrar la pestaña o al cerrar sesión, y vence a los 60 minutos.
const CLAVE_TOKEN = 'sv_token'
let token = sessionStorage.getItem(CLAVE_TOKEN)
let alVencerSesion = null

export function obtenerToken() {
  return token
}

export function guardarToken(nuevoToken) {
  token = nuevoToken
  if (nuevoToken) {
    sessionStorage.setItem(CLAVE_TOKEN, nuevoToken)
  } else {
    sessionStorage.removeItem(CLAVE_TOKEN)
  }
}

// El contexto registra aquí qué hacer cuando la API responde 401 con un token (vencido o inválido).
export function registrarAlVencerSesion(funcion) {
  alVencerSesion = funcion
}

// Antes de cada petición: si hay sesión, se agrega Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// Después de cada respuesta: un 401 con token significa que la sesión ya no es válida
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401 && token && alVencerSesion) {
      alVencerSesion()
    }
    return Promise.reject(error)
  }
)

// Convierte cualquier error de Axios en un mensaje para mostrar en pantalla (los 3 casos de la Guía 20).
export function obtenerMensajeError(error) {
  if (error.response) {
    const datos = error.response.data
    if (datos && typeof datos.mensaje === 'string') {
      const detalles = Array.isArray(datos.detalles) ? datos.detalles.join(' ') : ''
      return datos.mensaje + (detalles ? ' ' + detalles : '')
    }
    if (error.response.status === 403) return 'No tienes permiso para realizar esta acción.'
    return 'La API respondió con un error (' + error.response.status + ').'
  }
  if (error.code === 'ECONNABORTED') {
    return 'La API tardó demasiado. Inténtalo de nuevo.'
  }
  return 'No fue posible contactar la API. Revisa que el backend esté encendido.'
}