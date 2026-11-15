import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioCheckout from './FormularioCheckout'

const usuario = { nombre: 'Cliente Prueba', correo: 'cliente@correo.cl' }

describe('FormularioCheckout', () => {
  it('rellena nombre, apellidos y correo si hay sesión iniciada', () => {
    render(<FormularioCheckout usuario={usuario} onConfirmar={() => {}} />)

    expect(screen.getByLabelText('Nombre')).toHaveValue('Cliente')
    expect(screen.getByLabelText('Apellidos')).toHaveValue('Prueba')
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('cliente@correo.cl')
  })

  it('muestra errores y no confirma si faltan datos', async () => {
    const alConfirmar = vi.fn()
    render(<FormularioCheckout onConfirmar={alConfirmar} />)

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa una dirección válida.')).toBeInTheDocument()
    expect(alConfirmar).not.toHaveBeenCalled()
  })

  it('rechaza un teléfono con formato inválido', async () => {
    render(<FormularioCheckout usuario={usuario} onConfirmar={() => {}} />)

    await userEvent.type(screen.getByLabelText('Teléfono'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(screen.getByText('Ingresa un teléfono válido (ej: +56912345678).')).toBeInTheDocument()
  })

  it('confirma con el nombre completo y los datos de entrega', async () => {
    const alConfirmar = vi.fn()
    render(<FormularioCheckout usuario={usuario} onConfirmar={alConfirmar} />)

    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
    await userEvent.type(screen.getByLabelText('Dirección'), 'Av. Libertad 450')
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(alConfirmar).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Cliente Prueba',
        telefono: '+56912345678',
        direccion: 'Av. Libertad 450',
        tipoEntrega: 'Retiro en Tienda (Viña del Mar)',
      })
    )
  })

  it('envía el rechazo simulado cuando se marca la casilla', async () => {
    const alConfirmar = vi.fn()
    render(<FormularioCheckout usuario={usuario} onConfirmar={alConfirmar} />)

    await userEvent.type(screen.getByLabelText('Teléfono'), '+56912345678')
    await userEvent.type(screen.getByLabelText('Dirección'), 'Av. Libertad 450')
    await userEvent.click(screen.getByLabelText('Simular pago rechazado (demo)'))
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar y pagar' }))

    expect(alConfirmar).toHaveBeenCalledWith(expect.objectContaining({ simularRechazo: true }))
  })
})