import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Nosotros from './Nosotros'
import { renderConProveedores } from '../test/renderConProveedores'

describe('Página Nosotros', () => {
  it('muestra la información de la tienda', async () => {
    await renderConProveedores(<Nosotros />)

    expect(screen.getByRole('heading', { name: 'Sobre Sonido Vivo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quiénes somos' })).toBeInTheDocument()
  })

  it('el botón lleva al catálogo', async () => {
    await renderConProveedores(
      <Routes>
        <Route path="/" element={<Nosotros />} />
        <Route path="/catalogo" element={<p>Página del catálogo</p>} />
      </Routes>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Ver nuestro catálogo' }))

    expect(screen.getByText('Página del catálogo')).toBeInTheDocument()
  })
})