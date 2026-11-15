import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FiltroCategoria from './FiltroCategoria'

const marcas = ['Yamaha', 'Fender']

describe('FiltroCategoria', () => {
  it('muestra una casilla por cada marca disponible', () => {
    render(<FiltroCategoria marcasDisponibles={marcas} marcasSeleccionadas={[]} onCambiarMarca={() => {}} onAplicar={() => {}} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  })

  it('marca solo las marcas seleccionadas', () => {
    render(<FiltroCategoria marcasDisponibles={marcas} marcasSeleccionadas={['Fender']} onCambiarMarca={() => {}} onAplicar={() => {}} />)

    expect(screen.getByLabelText('Fender')).toBeChecked()
    expect(screen.getByLabelText('Yamaha')).not.toBeChecked()
  })

  it('avisa qué marca se marcó y cuándo se aplican los filtros', async () => {
    const alCambiarMarca = vi.fn()
    const alAplicar = vi.fn()
    render(<FiltroCategoria marcasDisponibles={marcas} marcasSeleccionadas={[]} onCambiarMarca={alCambiarMarca} onAplicar={alAplicar} />)

    await userEvent.click(screen.getByLabelText('Yamaha'))
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }))

    expect(alCambiarMarca).toHaveBeenCalledWith('Yamaha')
    expect(alAplicar).toHaveBeenCalledTimes(1)
  })
})