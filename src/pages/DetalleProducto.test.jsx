import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import DetalleProducto from './DetalleProducto'
import { productos } from '../data/productos'
import { renderConProveedores } from '../test/renderConProveedores'

const guitarra = productos.find((p) => p.codigo === 'GA001')

const conRuta = (ruta) =>
  renderConProveedores(
    <Routes>
      <Route path="/producto/:id" element={<DetalleProducto />} />
    </Routes>,
    { ruta }
  )

describe('Página DetalleProducto', () => {
  it('muestra la ficha del producto y su nombre en la pestaña (useEffect)', () => {
    conRuta('/producto/GA001')

    expect(screen.getByRole('heading', { level: 1, name: guitarra.nombre })).toBeInTheDocument()
    expect(document.title).toBe(`${guitarra.nombre} · Sonido Vivo`)
  })

  it('agrega el producto al carrito y muestra la confirmación', async () => {
    conRuta('/producto/GA001')

    await userEvent.click(screen.getByRole('button', { name: 'Añadir al Carrito' }))

    expect(screen.getByText('Se agregaron 1 unidad(es) al carrito.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Carrito (1)' })).toBeInTheDocument()
  })

  it('avisa si el producto no existe', () => {
    conRuta('/producto/XX999')
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument()
  })
})