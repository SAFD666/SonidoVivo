import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Checkout from './checkout'
import CompraExitosa from './CompraExitosa'
import PagoFallido from './PagoFallido'
import RutaProtegida from '../components/RutaProtegida'
import { productos } from '../data/productos'
import { renderConProveedores, cliente } from '../test/renderConProveedores'

const guitarra = productos.find((p) => p.codigo === 'GA001')

// Checkout protegido (como en App.jsx) + las páginas REALES a las que redirige
const conFlujo = (carrito) =>
  renderConProveedores(
    <Routes>
      <Route path="/checkout" element={<RutaProtegida roles={['Cliente']}><Checkout /></RutaProtegida>} />
      <Route path="/compra-exitosa" element={<CompraExitosa />} />
      <Route path="/pago-fallido" element={<PagoFallido />} />
    </Routes>,
    { ruta: '/checkout', usuario: cliente, carrito }
  )

// Nombre, apellidos y correo vienen precargados del usuario; se elige despacho con Región → Comuna
async function completarDespacho() {
  await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
  await userEvent.selectOptions(screen.getByLabelText('Tipo de entrega'), 'Despacho Starken')
  await userEvent.selectOptions(screen.getByLabelText('Región'), 'Valparaíso')
  await userEvent.selectOptions(screen.getByLabelText('Comuna'), 'Viña del Mar')
  await userEvent.type(screen.getByLabelText('Calle'), 'Av. Libertad')
  await userEvent.type(screen.getByLabelText('Número'), '450')
}

describe('Página Checkout', () => {
  it('avisa si no hay productos para pagar', async () => {
    await conFlujo([])
    expect(screen.getByText('No hay productos para pagar')).toBeInTheDocument()
  })

  it('carga las opciones de entrega y pago desde la API', async () => {
    await conFlujo([{ ...guitarra, cantidad: 1 }])

    expect(screen.getByRole('option', { name: 'Despacho Starken' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Transferencia bancaria' })).toBeInTheDocument()
  })

  it('una compra con despacho termina en "Compra exitosa" y vacía el carrito', async () => {
    await conFlujo([{ ...guitarra, cantidad: 1 }])

    await completarDespacho()
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(await screen.findByRole('heading', { name: '¡Compra realizada con éxito!' })).toBeInTheDocument()
    expect(screen.getByText('Av. Libertad 450, Viña del Mar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Carrito (0)' })).toBeInTheDocument()
  })

  it('si se simula el rechazo, va a "Pago fallido" con el motivo', async () => {
    await conFlujo([{ ...guitarra, cantidad: 1 }])

    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
    await userEvent.click(screen.getByLabelText('Simular pago rechazado (demo)'))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(await screen.findByRole('heading', { name: 'Pago fallido' })).toBeInTheDocument()
    expect(screen.getByText('El banco rechazó la transacción. Intenta con otro método de pago.')).toBeInTheDocument()
  })

  it('si se pide más que el stock, la API responde 409 y va a "Pago fallido"', async () => {
    await conFlujo([{ ...guitarra, cantidad: guitarra.stock + 1 }])

    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(await screen.findByText(`No hay stock suficiente de "${guitarra.nombre}".`)).toBeInTheDocument()
  })
})