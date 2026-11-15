import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TablaProductos from './TablaProductos'

const productos = [
  { codigo: 'GA001', nombre: 'Guitarra Acústica Folk', marca: 'Yamaha', modelo: 'F310', categoria: 'Guitarras Acústicas', precio: 129990, stock: 8, imagen: '/img/acustica.png', esOferta: false },
  { codigo: 'BA003', nombre: 'Bajo Activo 5 Cuerdas', marca: 'Yamaha', modelo: 'TRBX305', categoria: 'Bajos', precio: 379990, stock: 2, imagen: '/img/bajo.png', esOferta: true },
]

describe('TablaProductos', () => {
  it('muestra una fila por producto', () => {
    render(<TablaProductos productos={productos} onEditar={() => {}} onEliminar={() => {}} />)
    expect(screen.getByText('Productos del catálogo (2)')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('muestra solo los botones de las funciones que recibe', () => {
    render(<TablaProductos productos={productos} onEditar={() => {}} />)

    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(2)
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument()
  })

  it('al pulsar Editar, avisa con el producto de esa fila', async () => {
    const alEditar = vi.fn()
    render(<TablaProductos productos={productos} onEditar={alEditar} onEliminar={() => {}} />)

    await userEvent.click(screen.getAllByRole('button', { name: 'Editar' })[1])

    expect(alEditar).toHaveBeenCalledWith(productos[1])
  })
})