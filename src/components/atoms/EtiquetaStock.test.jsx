import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EtiquetaStock from './EtiquetaStock'

describe('EtiquetaStock', () => {
  it('muestra las unidades en plural', () => {
    render(<EtiquetaStock stock={5} />)
    expect(screen.getByText('Stock: 5 unidades')).toBeInTheDocument()
  })

  it('usa singular cuando queda 1 unidad', () => {
    render(<EtiquetaStock stock={1} />)
    expect(screen.getByText('Stock: 1 unidad')).toBeInTheDocument()
  })

  it('se marca como agotado cuando el stock es 0', () => {
    render(<EtiquetaStock stock={0} />)
    expect(screen.getByText('Stock: 0 unidades')).toHaveClass('agotado')
  })
})