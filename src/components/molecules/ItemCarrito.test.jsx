import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ItemCarrito from './ItemCarrito'

const item = {
  codigo: 'GA001',
  nombre: 'Guitarra Acústica Folk',
  imagen: '/img/acustica.png',
  precio: 1000,
  cantidad: 3,
  stock: 5,
}

describe('ItemCarrito', () => {
  it('muestra el producto, su precio y el subtotal', () => {
    render(<ItemCarrito {...item} onCambiarCantidad={() => {}} onEliminar={() => {}} />)

    expect(screen.getByText('Guitarra Acústica Folk')).toBeInTheDocument()
    expect(screen.getByText('$1.000')).toBeInTheDocument()
    expect(screen.getByText('$3.000')).toBeInTheDocument()
  })

  it('avisa la nueva cantidad al pulsar +', async () => {
    const alCambiar = vi.fn()
    render(<ItemCarrito {...item} onCambiarCantidad={alCambiar} onEliminar={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: '+' }))

    expect(alCambiar).toHaveBeenCalledWith(4)
  })

  it('avisa al padre al pulsar Eliminar', async () => {
    const alEliminar = vi.fn()
    render(<ItemCarrito {...item} onCambiarCantidad={() => {}} onEliminar={alEliminar} />)

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(alEliminar).toHaveBeenCalledTimes(1)
  })
})