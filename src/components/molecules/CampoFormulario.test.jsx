import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CampoFormulario from './CampoFormulario'

describe('CampoFormulario', () => {
  it('conecta la etiqueta con su campo', () => {
    render(<CampoFormulario label="Correo electrónico" id="correo" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
  })

  it('muestra el mensaje de error cuando lo recibe', () => {
    render(<CampoFormulario label="Correo" id="correo" value="" onChange={() => {}} error="Ingresa un correo válido." />)
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
  })

  it('no muestra mensaje de error si no hay error', () => {
    render(<CampoFormulario label="Correo" id="correo" value="" onChange={() => {}} />)
    expect(screen.queryByText('Ingresa un correo válido.')).not.toBeInTheDocument()
  })
})