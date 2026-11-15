import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Selector from './Selector'

describe('Selector', () => {
  it('muestra una opción por cada elemento recibido', () => {
    render(<Selector value="Enviado" opciones={['En preparación', 'Enviado', 'Entregado']} onChange={() => {}} />)
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('avisa al padre cuando se elige otra opción', async () => {
    const alCambiar = vi.fn()
    render(<Selector value="Enviado" opciones={['En preparación', 'Enviado', 'Entregado']} onChange={alCambiar} />)

    await userEvent.selectOptions(screen.getByRole('combobox'), 'Entregado')

    expect(alCambiar).toHaveBeenCalledTimes(1)
  })
})