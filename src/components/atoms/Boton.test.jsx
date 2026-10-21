import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Boton from './Boton'

describe('Boton', () => {
  it('muestra el texto recibido', () => {
    render(<Boton texto="Añadir al Carrito" />)
    expect(screen.getByRole('button', { name: 'Añadir al Carrito' })).toBeInTheDocument()
  })

  it('llama a onClick al hacer clic', async () => {
    const alHacerClic = vi.fn()
    render(<Boton texto="Comprar" onClick={alHacerClic} />)

    await userEvent.click(screen.getByRole('button'))

    expect(alHacerClic).toHaveBeenCalledTimes(1)
  })

  it('queda deshabilitado cuando deshabilitado es true', () => {
    render(<Boton texto="Sin Stock" deshabilitado={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})