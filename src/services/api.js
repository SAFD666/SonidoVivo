import axios from 'axios'

// Instancia única de Axios: dirección base y tiempo máximo de espera (Guía 20).
// En desarrollo, '/api/v1' pasa por el proxy de Vite hacia el backend en el puerto 8080.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
})

// Token JWT guardado SOLO en memoria (Guía 19): al recargar la página se pide iniciar sesión otra vez.
let token = null
let alVencerSesion = null

export function guardarToken(nuevoToken) {
  token = nuevoToken
}

// El contexto registra aquí qué hacer cuando la API responde 401 con un token (sesión vencida o inválida).
export function registrarAlVencerSesion(funcion) {
  alVencerSesion = funcion
}

// Antes de cada petición: si hay sesión, se agrega el encabezado Authorization: Bearer <token>
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
    // 1. El servidor respondió con error (400, 401, 403, 404, 409...): el backend envía { mensaje, detalles }
    const datos = error.response.data
    if (datos && typeof datos.mensaje === 'string') {
      const detalles = Array.isArray(datos.detalles) ? datos.detalles.join(' ') : ''
      return datos.mensaje + (detalles ? ' ' + detalles : '')
    }
    return 'La API respondió con un error (' + error.response.status + ').'
  }
  if (error.code === 'ECONNABORTED') {
    // 2. Se agotó el tiempo de espera
    return 'La API tardó demasiado. Inténtalo de nuevo.'
  }
  // 3. No hubo respuesta: backend apagado, red caída o CORS
  return 'No fue posible contactar la API. Revisa que el backend esté encendido.'
}