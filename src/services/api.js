import axios from 'axios'

// Instancia única de Axios: dirección base y tiempo máximo de espera (Guía 20).
// En desarrollo, '/api/v1' pasa por el proxy de Vite hacia el backend en el puerto 8080.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
})

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