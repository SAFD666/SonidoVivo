import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import AdminCriticos from './AdminCriticos'
import AdminProductos from './AdminProductos'
import { productos } from '../data/productos'
import { STOCK_CRITICO } from '../utils/precios'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const criticos = productos
  .filter((p) => p.stock <= STOCK_CRITICO)
  .sort((a, b) => a.stock - b.stock)

beforeEach(() => {
  window.scrollTo = vi.fn()
})

describe('Página AdminCriticos', () => {
  it('muestra solo los productos con stock crítico', async () => {
    await renderConProveedores(<AdminCriticos />, { ruta: '/admin/criticos', usuario: admin })

    expect(screen.getByRole('heading', { level: 1, name: 'Stock crítico' })).toBeInTheDocument()
    expect(screen.getByText(`Productos del catálogo (${criticos.length})`)).toBeInTheDocument()
  })

  it('"Editar" abre ese producto en AdminProductos (location.state)', async () => {
    await renderConProveedores(
      <Routes>
        <Route path="/admin/criticos" element={<AdminCriticos />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
      </Routes>,
      { ruta: '/admin/criticos', usuario: admin }
    )

    await userEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    expect(await screen.findByRole('heading', { name: `Editar producto ${criticos[0].codigo}` })).toBeInTheDocument()
  })
})