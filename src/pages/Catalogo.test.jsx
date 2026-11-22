import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Catalogo from './Catalogo'
import { productos } from '../data/productos'
import { renderConProveedores } from '../test/renderConProveedores'

const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

describe('Página Catálogo', () => {
  it('muestra todos los productos que entrega la API', async () => {
    await renderConProveedores(<Catalogo />, { ruta: '/catalogo' })

    expect(screen.getByRole('heading', { name: 'Instrumentos y Equipos' })).toBeInTheDocument()
    expect(screen.getByText(`Mostrando ${productos.length} productos`)).toBeInTheDocument()
  })

  it('filtra por la búsqueda que viene en la URL', async () => {
    const esperados = productos.filter((p) =>
      normalizar(`${p.nombre} ${p.marca} ${p.modelo} ${p.categoria}`).includes('yamaha')
    )
    await renderConProveedores(<Catalogo />, { ruta: '/catalogo?buscar=yamaha' })

    expect(screen.getByRole('heading', { name: 'Resultados para "yamaha"' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(esperados.length)
  })

  it('avisa cuando la búsqueda no tiene resultados', async () => {
    await renderConProveedores(<Catalogo />, { ruta: '/catalogo?buscar=violin' })
    expect(screen.getByRole('heading', { name: 'Sin resultados' })).toBeInTheDocument()
  })
})