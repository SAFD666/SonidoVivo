import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import PagoFallido from './PagoFallido'
import { renderConProveedores } from '../test/renderConProveedores'

describe('Página PagoFallido', () => {
  it('muestra el motivo que recibe por location.state', () => {
    renderConProveedores(<PagoFallido />, {
      ruta: { pathname: '/pago-fallido', state: { motivo: 'Tarjeta sin fondos.' } },
    })

    expect(screen.getByRole('heading', { name: 'Pago fallido' })).toBeInTheDocument()
    expect(screen.getByText('Tarjeta sin fondos.')).toBeInTheDocument()
  })

  it('sin motivo, muestra el mensaje por defecto y los botones', () => {
    renderConProveedores(<PagoFallido />, { ruta: '/pago-fallido' })

    expect(screen.getByText('Ocurrio un problema con el pago. Intentalo nuevamente.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Intentar nuevamente' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Volver al carrito' })).toBeInTheDocument()
  })
})