import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import AdminHistorial from './AdminHistorial'
import { pedidosIniciales } from '../data/pedidos'
import { renderConProveedores, admin, cliente, vendedor } from '../test/renderConProveedores'

const conRuta = (ruta) =>
  renderConProveedores(
    <Routes>
      <Route path="/admin/usuarios/:id/pedidos" element={<AdminHistorial />} />
    </Routes>,
    { ruta, usuario: admin }
  )

describe('Página AdminHistorial', () => {
  it('muestra los pedidos del usuario de la URL', () => {
    const suyos = pedidosIniciales.filter((p) => p.clienteCorreo === cliente.correo)
    conRuta(`/admin/usuarios/${cliente.id}/pedidos`)

    expect(screen.getByRole('heading', { level: 1, name: `Historial de ${cliente.nombre}` })).toBeInTheDocument()
    expect(screen.getByText(`Pedidos registrados en la tienda (${suyos.length})`)).toBeInTheDocument()
  })

  it('avisa si el usuario no tiene pedidos', () => {
    conRuta(`/admin/usuarios/${vendedor.id}/pedidos`)
    expect(screen.getByText('Este usuario todavía no ha realizado pedidos.')).toBeInTheDocument()
  })

  it('avisa si el usuario no existe', () => {
    conRuta('/admin/usuarios/999/pedidos')
    expect(screen.getByText('Usuario no encontrado')).toBeInTheDocument()
  })
})