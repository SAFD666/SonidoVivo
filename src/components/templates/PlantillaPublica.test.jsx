import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
import PlantillaPublica from './PlantillaPublica'
import { renderConProveedores } from '../../test/renderConProveedores'

describe('PlantillaPublica', () => {
  it('dibuja el contenido recibido (props.children) dentro del main', () => {
    renderConProveedores(<PlantillaPublica><p>Contenido de prueba</p></PlantillaPublica>)

    const principal = screen.getByRole('main')
    expect(within(principal).getByText('Contenido de prueba')).toBeInTheDocument()
  })

  it('incluye el encabezado y el pie de página', () => {
    renderConProveedores(<PlantillaPublica><p>Contenido</p></PlantillaPublica>)

    expect(screen.getByRole('banner')).toBeInTheDocument()       // <header>
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()  // <footer>
  })
})