import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import PaginaCarrito from './Carrito'
import { productos } from '../data/productos'
import { renderConProveedores, cliente } from '../test/renderConProveedores'

const guitarra = productos.find((p) => p.codigo === 'GA001')
const carritoConGuitarra = [{ ...guitarra, cantidad: 2 }]

describe('Página Carrito', () => {
  it('sin sesión, muestra los productos y pide iniciar sesión para pagar', async () => {
    await renderConProveedores(<PaginaCarrito />, { carrito: carritoConGuitarra })

    expect(screen.getByRole('heading', { name: 'Mi Carrito' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: guitarra.nombre })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inicia sesión para pagar' })).toBeInTheDocument()
  })

  it('con sesión, el botón "Ir a pagar" lleva al checkout', async () => {
    await renderConProveedores(
      <Routes>
        <Route path="/" element={<PaginaCarrito />} />
        <Route path="/checkout" element={<p>Página de pago</p>} />
      </Routes>,
      { usuario: cliente, carrito: carritoConGuitarra }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Ir a pagar' }))

    expect(screen.getByText('Página de pago')).toBeInTheDocument()
  })

  it('al vaciar el carrito muestra el aviso de carrito vacío', async () => {
    await renderConProveedores(<PaginaCarrito />, { carrito: carritoConGuitarra })

    await userEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })
})