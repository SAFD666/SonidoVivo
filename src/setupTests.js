import '@testing-library/jest-dom/vitest'
import { vi, beforeEach } from 'vitest'
import { reiniciarApiFalsa } from './test/apiFalsa'
import { guardarToken } from './services/api'

// Los services reales usan Axios contra el backend. En las pruebas se reemplazan por la API falsa
// en memoria (src/test/apiFalsa.js), con los mismos datos de src/data y las mismas reglas.
vi.mock('./services/catalogoService', async () => (await import('./test/apiFalsa')).catalogoFalso)
vi.mock('./services/authService', async () => (await import('./test/apiFalsa')).authFalso)
vi.mock('./services/pedidoService', async () => (await import('./test/apiFalsa')).pedidoFalso)
vi.mock('./services/usuarioService', async () => (await import('./test/apiFalsa')).usuarioFalso)

// Cada prueba parte con los datos iniciales, sin sesión y con el navegador limpio
beforeEach(() => {
  reiniciarApiFalsa()
  guardarToken(null)
  localStorage.clear()
  sessionStorage.clear()
})