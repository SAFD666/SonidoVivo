import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EstadoPedido from './EstadoPedido'

describe('EstadoPedido', () => {
  it('muestra el estado en verde cuando está Entregado', () => {
    render(<EstadoPedido estado="Entregado" />)
    expect(screen.getByText('Entregado')).toHaveClass('estado-entregado')
  })

  it('muestra el estado en rojo cuando está Cancelado', () => {
    render(<EstadoPedido estado="Cancelado" />)
    expect(screen.getByText('Cancelado')).toHaveClass('estado-cancelado')
  })
})