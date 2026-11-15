import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BotonFavorito from './BotonFavorito'

describe('BotonFavorito', () => {
  it('empieza sin marcar', () => {
    render(<BotonFavorito nombreProducto="Guitarra Acústica Folk" />)
    expect(screen.getByRole('button', { name: '☆ Agregar a favoritos' })).toBeInTheDocument()
  })

  it('cambia a "En favoritos" al hacer clic', async () => {
    render(<BotonFavorito nombreProducto="Guitarra Acústica Folk" />)

    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('button', { name: '★ En favoritos' })).toBeInTheDocument()
  })

  it('parte marcado si recibe favoritoInicial', () => {
    render(<BotonFavorito nombreProducto="Bajo Activo 5 Cuerdas" favoritoInicial={true} />)
    expect(screen.getByRole('button', { name: '★ En favoritos' })).toBeInTheDocument()
  })
})