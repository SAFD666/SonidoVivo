import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Checkout from './checkout'
import CompraExitosa from './CompraExitosa'
import PagoFallido from './PagoFallido'
import { productos } from '../data/productos'
import { renderConProveedores, cliente } from '../test/renderConProveedores'

const guitarra = productos.find((p) => p.codigo === 'GA001')

// Checkout + las páginas REALES a las que redirige
const conFlujo = (carrito) =>
  renderConProveedores(
    <Routes>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/compra-exitosa" element={<CompraExitosa />} />
      <Route path="/pago-fallido" element={<PagoFallido />} />
    </Routes>,
    { ruta: '/checkout', usuario: cliente, carrito }
  )

// Nombre, apellidos y correo vienen precargados del usuario; faltan teléfono y dirección
async function completarDatos() {
  await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
  await userEvent.type(screen.getByLabelText('Dirección'), 'Av. Libertad 450, Viña del Mar')
}

describe('Página Checkout', () => {
  it('avisa si no hay productos para pagar', () => {
    conFlujo([])
    expect(screen.getByText('No hay productos para pagar')).toBeInTheDocument()
  })

  it('una compra válida termina en "Compra exitosa" y vacía el carrito', async () => {
    conFlujo([{ ...guitarra, cantidad: 1 }])

    await completarDatos()
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(screen.getByRole('heading', { name: '¡Compra realizada con éxito!' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Carrito (0)' })).toBeInTheDocument()
  })

  it('si se simula el rechazo, va a "Pago fallido" con el motivo', async () => {
    conFlujo([{ ...guitarra, cantidad: 1 }])

    await completarDatos()
    await userEvent.click(screen.getByLabelText('Simular pago rechazado (demo)'))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(screen.getByRole('heading', { name: 'Pago fallido' })).toBeInTheDocument()
    expect(screen.getByText('El banco rechazó la transacción. Intenta con otro método de pago.')).toBeInTheDocument()
  })

  it('si se pide más que el stock, va a "Pago fallido" por falta de stock', async () => {
    conFlujo([{ ...guitarra, cantidad: guitarra.stock + 1 }])

    await completarDatos()
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(screen.getByText(`No hay stock suficiente de "${guitarra.nombre}".`)).toBeInTheDocument()
  })
})