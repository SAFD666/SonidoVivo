import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminCategorias from './AdminCategorias'
import { categoriasIniciales } from '../data/categorias'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const total = categoriasIniciales.length
const abrir = () => renderConProveedores(<AdminCategorias />, { ruta: '/admin/categorias', usuario: admin })

beforeEach(() => {
  window.scrollTo = vi.fn()
})

describe('Página AdminCategorias', () => {
  it('lista todas las categorías', async () => {
    await abrir()
    expect(screen.getByText(`Categorías de la tienda (${total})`)).toBeInTheDocument()
  })

  it('no permite crear una categoría repetida (409)', async () => {
    await abrir()

    await userEvent.type(screen.getByLabelText('Nombre'), 'Bajos')
    await userEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))

    expect(await screen.findByText('Ya existe una categoría con ese nombre.')).toBeInTheDocument()
  })

  it('crea una categoría nueva', async () => {
    await abrir()

    await userEvent.type(screen.getByLabelText('Nombre'), 'Instrumentos de Viento')
    await userEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))

    expect(await screen.findByText('Categoría "Instrumentos de Viento" creada.')).toBeInTheDocument()
    expect(await screen.findByText(`Categorías de la tienda (${total + 1})`)).toBeInTheDocument()
  })
})