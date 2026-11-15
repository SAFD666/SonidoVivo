import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import { productos } from '../data/productos'
import { pedidosIniciales } from '../data/pedidos'
import { STOCK_CRITICO } from '../utils/precios'
import { renderConProveedores, admin } from '../test/renderConProveedores'

describe('Página AdminDashboard', () => {
  it('muestra los 4 indicadores calculados con los datos', () => {
    const criticos = productos.filter((p) => p.stock <= STOCK_CRITICO).length
    const validos = pedidosIniciales.filter((p) => p.estado !== 'Cancelado').length
    renderConProveedores(<AdminDashboard />, { ruta: '/admin', usuario: admin })

    expect(screen.getByRole('heading', { level: 1, name: 'Panel de control' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(4)
    expect(screen.getByText(`${criticos} con stock crítico`)).toBeInTheDocument()
    expect(screen.getByText(`${validos} pedidos válidos`)).toBeInTheDocument()
  })

  it('cada pedido enlaza a su comprobante', () => {
    renderConProveedores(<AdminDashboard />, { ruta: '/admin', usuario: admin })

    expect(screen.getByRole('link', { name: 'PED-1001' })).toHaveAttribute('href', '/admin/pedidos/PED-1001')
  })

  it('el acceso rápido lleva a stock crítico', async () => {
    renderConProveedores(
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/criticos" element={<p>Página de stock crítico</p>} />
      </Routes>,
      { ruta: '/admin', usuario: admin }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Ver stock crítico' }))

    expect(screen.getByText('Página de stock crítico')).toBeInTheDocument()
  })
})