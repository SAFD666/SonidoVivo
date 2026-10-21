import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Precio from './Precio'

describe('Precio', () => {
  it('muestra el precio con $ y separador de miles', () => {
    render(<Precio precio={129990} />)
    expect(screen.getByText('$129.990')).toBeInTheDocument()
  })
})