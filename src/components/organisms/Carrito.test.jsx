import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Carrito from './Carrito'

const items = [
  { codigo: 'GA001', nombre: 'Guitarra Acústica Folk', imagen: '/img/acustica.png', precio: 129990, cantidad: 1, stock: 5 },
  { codigo: 'EF001', nombre: 'Pedal Distorsión Clásico', imagen: '/img/pedales.png', precio: 59990, cantidad: 2, stock: 10 },
]

describe('Carrito', () => {
  it('muestra un ítem por cada producto del carrito', () => {
    render(<Carrito items={items} onCambiarCantidad={() => {}} onEliminar={() => {}} />)
    expect(screen.getAllByRole('button', { name: 'Eliminar' })).toHaveLength(2)
  })

  it('al eliminar, avisa con el código del producto de esa fila', async () => {
    const alEliminar = vi.fn()
    render(<Carrito items={items} onCambiarCantidad={() => {}} onEliminar={alEliminar} />)

    await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[1])

    expect(alEliminar).toHaveBeenCalledWith('EF001')
  })

  it('al pulsar +, avisa el código y la nueva cantidad', async () => {
    const alCambiar = vi.fn()
    render(<Carrito items={items} onCambiarCantidad={alCambiar} onEliminar={() => {}} />)

    await userEvent.click(screen.getAllByRole('button', { name: '+' })[0])

    expect(alCambiar).toHaveBeenCalledWith('GA001', 2)
  })
})