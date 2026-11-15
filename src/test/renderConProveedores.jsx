import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TiendaProvider } from '../context/TiendaContext'

// Usuarios de prueba reutilizables
export const cliente = { id: 3, nombre: 'Cliente Prueba', correo: 'cliente@correo.cl', password: 'cliente123', rol: 'Cliente', activo: true }
export const vendedor = { id: 2, nombre: 'Matías Vendedor', correo: 'vendedor@sonidovivo.cl', password: 'vendedor123', rol: 'Vendedor', activo: true }
export const admin = { id: 1, nombre: 'Carlos Dueño (Admin)', correo: 'admin@sonidovivo.cl', password: 'admin123', rol: 'Administrador', activo: true }

// Dibuja un componente dentro del router y del contexto de la tienda.
// opciones.ruta: la URL inicial · opciones.usuario: sesión iniciada · opciones.carrito: productos en el carrito
export function renderConProveedores(componente, opciones = {}) {
  const { ruta = '/', usuario = null, carrito = [] } = opciones

  localStorage.clear()
  if (usuario) localStorage.setItem('sv_usuario_activo', JSON.stringify(usuario))
  localStorage.setItem('sv_carrito', JSON.stringify(carrito))

  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <TiendaProvider>{componente}</TiendaProvider>
    </MemoryRouter>
  )
}