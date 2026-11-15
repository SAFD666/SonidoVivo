import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CatalogoProductos from './CatalogoProductos'

const productos = [
  { codigo: 'GA001', nombre: 'Guitarra Acústica Folk', marca: 'Yamaha', modelo: 'F310', precio: 129990, stock: 8, imagen: '/img/acustica.png', esOferta: false },
  { codigo: 'GA002', nombre: 'Guitarra Acústica Dreadnought', marca: 'Fender', modelo: 'CD-60S', precio: 189990, stock: 5, imagen: '/img/acustica.png', esOferta: true },
]

describe('CatalogoProductos', () => {
  it('muestra una tarjeta por cada producto', () => {
    render(<CatalogoProductos productos={productos} onVer={() => {}} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('al pulsar Ver detalle, avisa con el producto completo de esa tarjeta', async () => {
    const alVer = vi.fn()
    render(<CatalogoProductos productos={productos} onVer={alVer} />)

    await userEvent.click(screen.getAllByRole('button', { name: 'Ver detalle' })[1])

    expect(alVer).toHaveBeenCalledWith(productos[1])
  })

  it('muestra la etiqueta ¡Oferta! solo en los productos en oferta', () => {
    render(<CatalogoProductos productos={productos} onVer={() => {}} />)
    expect(screen.getAllByText('¡Oferta!')).toHaveLength(1)
  })
})