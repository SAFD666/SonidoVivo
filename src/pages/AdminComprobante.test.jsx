import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import AdminComprobante from './AdminComprobante'
import { pedidosIniciales } from '../data/pedidos'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const conRuta = (ruta) =>
  renderConProveedores(
    <Routes>
      <Route path="/admin/pedidos/:id" element={<AdminComprobante />} />
    </Routes>,
    { ruta, usuario: admin }
  )

describe('Página AdminComprobante', () => {
  it('muestra el comprobante del pedido de la URL', async () => {
    const pedido = pedidosIniciales[0]
    await conRuta(`/admin/pedidos/${pedido.id}`)

    expect(screen.getByRole('heading', { level: 1, name: `Comprobante ${pedido.id}` })).toBeInTheDocument()
    expect(screen.getByText(pedido.clienteCorreo)).toBeInTheDocument()
    expect(screen.getByText(pedido.items[0].nombre)).toBeInTheDocument()
  })

  it('avisa si el pedido no existe', async () => {
    await conRuta('/admin/pedidos/PED-0000')
    expect(screen.getByText('Pedido no encontrado')).toBeInTheDocument()
  })
})