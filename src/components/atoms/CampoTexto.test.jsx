import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CampoTexto from './CampoTexto'

describe('CampoTexto', () => {
  it('muestra el valor y el tipo recibidos por props', () => {
    render(<CampoTexto type="email" value="cliente@correo.cl" onChange={() => {}} />)

    const campo = screen.getByRole('textbox')
    expect(campo).toHaveValue('cliente@correo.cl')
    expect(campo).toHaveAttribute('type', 'email')
  })

  it('avisa al padre por cada letra que se escribe', async () => {
    const alEscribir = vi.fn()
    render(<CampoTexto value="" onChange={alEscribir} />)

    await userEvent.type(screen.getByRole('textbox'), 'hola')

    expect(alEscribir).toHaveBeenCalledTimes(4)
  })
})