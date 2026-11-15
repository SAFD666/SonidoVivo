import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import RutaProtegida from './RutaProtegida'
import { renderConProveedores, cliente, admin } from '../test/renderConProveedores'

const rutas = (
  <Routes>
    <Route path="/" element={<p>Página de inicio</p>} />
    <Route path="/login" element={<p>Página de login</p>} />
    <Route path="/privado" element={<RutaProtegida roles={['Cliente']}><p>Contenido privado</p></RutaProtegida>} />
  </Routes>
)

describe('RutaProtegida', () => {
  it('sin sesión, redirige al login', () => {
    renderConProveedores(rutas, { ruta: '/privado' })
    expect(screen.getByText('Página de login')).toBeInTheDocument()
  })

  it('con el rol permitido, muestra el contenido (props.children)', () => {
    renderConProveedores(rutas, { ruta: '/privado', usuario: cliente })
    expect(screen.getByText('Contenido privado')).toBeInTheDocument()
  })

  it('con un rol no permitido, redirige al inicio', () => {
    renderConProveedores(rutas, { ruta: '/privado', usuario: admin })
    expect(screen.getByText('Página de inicio')).toBeInTheDocument()
  })
})