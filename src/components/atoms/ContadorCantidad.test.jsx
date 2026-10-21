import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContadorCantidad from './ContadorCantidad'

describe('ContadorCantidad', () => {
  it('empieza en 1', () => {
    render(<ContadorCantidad maximo={5} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('sube a 2 al pulsar +', async () => {
    render(<ContadorCantidad maximo={5} />)

    await userEvent.click(screen.getByRole('button', { name: '+' }))

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('no deja bajar de 1', () => {
    render(<ContadorCantidad maximo={5} />)
    expect(screen.getByRole('button', { name: '-' })).toBeDisabled()
  })
})