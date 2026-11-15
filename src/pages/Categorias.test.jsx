import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import Categorias from './Categorias'
import { productos } from '../data/productos'
import { renderConProveedores } from '../test/renderConProveedores'

const conRuta = (ruta) =>
  renderConProveedores(
    <Routes>
      <Route path="/categoria/:slug" element={<Categorias />} />
    </Routes>,
    { ruta }
  )

describe('Página Categorías', () => {
  it('muestra solo los productos de la categoría de la URL', () => {
    const bajos = productos.filter((p) => p.categoria === 'Bajos')
    conRuta('/categoria/bajos')

    expect(screen.getByRole('heading', { level: 1, name: 'Bajos' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(bajos.length)
  })

  it('avisa si la categoría no tiene productos', () => {
    conRuta('/categoria/violines')
    expect(screen.getByText('No hay productos en esta categoría')).toBeInTheDocument()
  })
})