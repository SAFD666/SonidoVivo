import { render, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TiendaProvider } from '../context/TiendaContext'
import { guardarToken } from '../services/api'

// Usuarios de prueba (los mismos de src/data/usuarios.js)
export const cliente = { id: 3, nombre: 'Cliente Prueba', correo: 'cliente@correo.cl', password: 'cliente123', rol: 'Cliente', activo: true }
export const vendedor = { id: 2, nombre: 'Matías Vendedor', correo: 'vendedor@sonidovivo.cl', password: 'vendedor123', rol: 'Vendedor', activo: true }
export const admin = { id: 1, nombre: 'Carlos Dueño (Admin)', correo: 'admin@sonidovivo.cl', password: 'admin123', rol: 'Administrador', activo: true }

// Deja terminar las peticiones pendientes a la API falsa (catálogo, /auth/me, pedidos, usuarios)
export async function esperarCargas() {
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await new Promise((resolver) => setTimeout(resolver, 0))
    })
  }
}

// Dibuja un componente dentro del router y del contexto de la tienda, y espera a que carguen los datos.
// opciones.ruta: URL inicial · opciones.usuario: sesión iniciada (token en sessionStorage) · opciones.carrito
export async function renderConProveedores(componente, opciones = {}) {
  const { ruta = '/', usuario = null, carrito = [] } = opciones

  localStorage.clear()
  sessionStorage.clear()
  guardarToken(usuario ? `token-${usuario.id}` : null)
  localStorage.setItem('sv_carrito', JSON.stringify(carrito))

  const resultado = render(
    <MemoryRouter initialEntries={[ruta]}>
      <TiendaProvider>{componente}</TiendaProvider>
    </MemoryRouter>
  )
  await esperarCargas()
  return resultado
}