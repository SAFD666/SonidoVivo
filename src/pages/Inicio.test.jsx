import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Inicio from './Inicio'
import { categoriasIniciales } from '../data/categorias'
import { renderConProveedores } from '../test/renderConProveedores'

describe('Página Inicio', () => {
  it('muestra el banner y una tarjeta por cada categoría', () => {
    renderConProveedores(<Inicio />)

    expect(screen.getByRole('heading', { name: 'Instrumentos Musicales y Equipos de Sonido' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(categoriasIniciales.length)
  })

  it('al hacer clic en una categoría, navega a su página', async () => {
    renderConProveedores(
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/categoria/:slug" element={<p>Página de la categoría</p>} />
      </Routes>
    )

    await userEvent.click(screen.getByText('Bajos'))

    expect(screen.getByText('Página de la categoría')).toBeInTheDocument()
  })
})