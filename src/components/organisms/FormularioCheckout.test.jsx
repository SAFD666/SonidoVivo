import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioCheckout from './FormularioCheckout'

const usuario = { nombre: 'Cliente Prueba', correo: 'cliente@correo.cl' }

// Las mismas opciones que entrega la API (GET /pedidos/opciones y GET /regiones), pasadas por props
const opciones = {
  tiposEntrega: ['Retiro en Tienda (Viña del Mar)', 'Despacho Starken', 'Despacho Chilexpress'],
  metodosPago: ['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia bancaria'],
  regiones: [
    { id: 6, nombre: 'Valparaíso', comunas: [{ id: 12, nombre: 'Viña del Mar' }] },
    { id: 11, nombre: 'Biobío', comunas: [{ id: 30, nombre: 'Concepción' }] },
  ],
}

const dibujar = (props) => render(<FormularioCheckout {...opciones} {...props} />)

describe('FormularioCheckout', () => {
  it('rellena nombre, apellidos y correo si hay sesión iniciada', () => {
    dibujar({ usuario, onConfirmar: () => {} })

    expect(screen.getByLabelText('Nombre')).toHaveValue('Cliente')
    expect(screen.getByLabelText('Apellidos')).toHaveValue('Prueba')
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('cliente@correo.cl')
  })

  it('con retiro en tienda no pide dirección', () => {
    dibujar({ usuario, onConfirmar: () => {} })

    expect(screen.queryByLabelText('Región')).not.toBeInTheDocument()
    expect(screen.getByText(/no necesitas dirección/)).toBeInTheDocument()
  })

  it('muestra errores y no confirma si faltan datos del despacho', async () => {
    const alConfirmar = vi.fn()
    dibujar({ onConfirmar: alConfirmar })

    await userEvent.selectOptions(screen.getByLabelText('Tipo de entrega'), 'Despacho Starken')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Elige la región y la comuna.')).toBeInTheDocument()
    expect(alConfirmar).not.toHaveBeenCalled()
  })

  it('rechaza un teléfono con formato inválido', async () => {
    dibujar({ usuario, onConfirmar: () => {} })

    await userEvent.type(screen.getByLabelText('Teléfono'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(screen.getByText('Ingresa un teléfono válido (ej: +56912345678).')).toBeInTheDocument()
  })

  it('confirma un retiro en tienda sin dirección', async () => {
    const alConfirmar = vi.fn()
    dibujar({ usuario, onConfirmar: alConfirmar })

    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(alConfirmar).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Cliente Prueba',
        telefono: '+56912345678',
        tipoEntrega: 'Retiro en Tienda (Viña del Mar)',
        direccion: null,
      })
    )
  })

  it('confirma un despacho con la dirección por partes (Región → Comuna)', async () => {
    const alConfirmar = vi.fn()
    dibujar({ usuario, onConfirmar: alConfirmar })

    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
    await userEvent.selectOptions(screen.getByLabelText('Tipo de entrega'), 'Despacho Starken')
    await userEvent.selectOptions(screen.getByLabelText('Región'), 'Valparaíso')
    await userEvent.selectOptions(screen.getByLabelText('Comuna'), 'Viña del Mar')
    await userEvent.type(screen.getByLabelText('Calle'), 'Av. Libertad')
    await userEvent.type(screen.getByLabelText('Número'), '450')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(alConfirmar).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoEntrega: 'Despacho Starken',
        direccion: { calle: 'Av. Libertad', numero: '450', depto: '', idComuna: 12 },
      })
    )
  })

  it('envía el rechazo simulado cuando se marca la casilla', async () => {
    const alConfirmar = vi.fn()
    dibujar({ usuario, onConfirmar: alConfirmar })

    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
    await userEvent.click(screen.getByLabelText('Simular pago rechazado (demo)'))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(alConfirmar).toHaveBeenCalledWith(expect.objectContaining({ simularRechazo: true }))
  })
})