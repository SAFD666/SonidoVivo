import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import DetalleBlog from './DetalleBlog'
import { entradasBlog } from '../data/blog'
import { renderConProveedores } from '../test/renderConProveedores'

const conRuta = (ruta) =>
  renderConProveedores(
    <Routes>
      <Route path="/blog/:id" element={<DetalleBlog />} />
    </Routes>,
    { ruta }
  )

describe('Página DetalleBlog', () => {
  it('muestra la entrada que indica la URL', async () => {
    const entrada = entradasBlog[1]
    await conRuta(`/blog/${entrada.id}`)

    expect(screen.getByRole('heading', { name: entrada.titulo })).toBeInTheDocument()
  })

  it('avisa si la entrada no existe', async () => {
    await conRuta('/blog/no-existe')
    expect(screen.getByText('Entrada no encontrada')).toBeInTheDocument()
  })
})