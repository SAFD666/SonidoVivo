import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BarraBusqueda from './BarraBusqueda'

describe('BarraBusqueda', () => {
  it('muestra el texto inicial recibido', () => {
    render(<BarraBusqueda valorInicial="yamaha" onBuscar={() => {}} />)
    expect(screen.getByLabelText('Buscar productos')).toHaveValue('yamaha')
  })

  it('envía el texto escrito al pulsar Buscar', async () => {
    const alBuscar = vi.fn()
    render(<BarraBusqueda onBuscar={alBuscar} />)

    await userEvent.type(screen.getByLabelText('Buscar productos'), 'fender')
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(alBuscar).toHaveBeenCalledWith('fender')
  })

  it('quita los espacios de los extremos al buscar con Enter', async () => {
    const alBuscar = vi.fn()
    render(<BarraBusqueda onBuscar={alBuscar} />)

    await userEvent.type(screen.getByLabelText('Buscar productos'), '  boss  {enter}')

    expect(alBuscar).toHaveBeenCalledWith('boss')
  })
})