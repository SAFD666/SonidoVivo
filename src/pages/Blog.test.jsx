import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Blog from './Blog'
import { entradasBlog } from '../data/blog'
import { renderConProveedores } from '../test/renderConProveedores'

describe('Página Blog', () => {
  it('muestra una tarjeta por cada entrada del blog', async () => {
    await renderConProveedores(<Blog />)
    expect(screen.getAllByRole('article')).toHaveLength(entradasBlog.length)
  })

  it('cada "Leer más" enlaza al detalle de su entrada', async () => {
    await renderConProveedores(<Blog />)

    const enlaces = screen.getAllByRole('link', { name: 'Leer más' })
    expect(enlaces[0]).toHaveAttribute('href', `/blog/${entradasBlog[0].id}`)
  })
})