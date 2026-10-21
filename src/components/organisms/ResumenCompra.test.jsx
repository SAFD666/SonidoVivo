import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResumenCompra from './ResumenCompra'

const carrito = [
  { codigo: 'GA001', nombre: 'Guitarra Acústica Folk', precio: 129990, cantidad: 2 },
  { codigo: 'EF001', nombre: 'Pedal Distorsión Clásico', precio: 59990, cantidad: 1 },
]

describe('ResumenCompra', () => {
  it('muestra cada producto con su cantidad', () => {
    render(<ResumenCompra items={carrito} total={319970} />)

    expect(screen.getByText('2 x Guitarra Acústica Folk')).toBeInTheDocument()
    expect(screen.getByText('1 x Pedal Distorsión Clásico')).toBeInTheDocument()
  })

  it('muestra el total a pagar con formato de precio', () => {
    render(<ResumenCompra items={carrito} total={319970} />)
    expect(screen.getByText('$319.970')).toBeInTheDocument()
  })

  it('cuenta el total de unidades del carrito', () => {
    render(<ResumenCompra items={carrito} total={319970} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})