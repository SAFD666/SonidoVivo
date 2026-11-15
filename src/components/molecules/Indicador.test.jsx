import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Indicador from './Indicador'

describe('Indicador', () => {
  it('muestra el título, el valor y el detalle', () => {
    render(<Indicador titulo="Ventas" valor="$319.970" detalle="2 pedidos válidos" />)

    expect(screen.getByText('Ventas')).toBeInTheDocument()
    expect(screen.getByText('$319.970')).toBeInTheDocument()
    expect(screen.getByText('2 pedidos válidos')).toBeInTheDocument()
  })

  it('agrega la clase alerta cuando alerta es true', () => {
    render(<Indicador titulo="Productos" valor={46} alerta={true} />)
    expect(screen.getByRole('article')).toHaveClass('alerta')
  })

  it('no muestra el párrafo de detalle si no lo recibe', () => {
    const { container } = render(<Indicador titulo="Clientes" valor={3} />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})