import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TarjetaProducto from './TarjetaProducto'

// Datos de un producto real del catálogo
const guitarra = {
  codigo: 'GA001',
  nombre: 'Guitarra Acústica Folk',
  marca: 'Yamaha',
  modelo: 'F310',
  precio: 129990,
  stock: 8,
  imagen: '/img/acustica.png',
}

describe('TarjetaProducto', () => {
  it('muestra el nombre y el precio del producto', () => {
    render(<TarjetaProducto {...guitarra} onVer={() => {}} />)

    expect(screen.getByText('Guitarra Acústica Folk')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
  })

  it('muestra la etiqueta ¡Oferta! cuando el producto está en oferta', () => {
    render(<TarjetaProducto {...guitarra} esOferta={true} onVer={() => {}} />)
    expect(screen.getByText('¡Oferta!')).toBeInTheDocument()
  })

  it('no muestra la etiqueta ¡Oferta! cuando no está en oferta', () => {
    render(<TarjetaProducto {...guitarra} esOferta={false} onVer={() => {}} />)
    expect(screen.queryByText('¡Oferta!')).not.toBeInTheDocument()
  })

  it('llama a onVer al pulsar Ver detalle', async () => {
    const alVer = vi.fn()
    render(<TarjetaProducto {...guitarra} onVer={alVer} />)

    await userEvent.click(screen.getByRole('button', { name: 'Ver detalle' }))

    expect(alVer).toHaveBeenCalledTimes(1)
  })
})