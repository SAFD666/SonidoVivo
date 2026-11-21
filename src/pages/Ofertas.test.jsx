import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Ofertas from './Ofertas'
import { productos } from '../data/productos'
import { renderConProveedores } from '../test/renderConProveedores'

const enOferta = productos.filter((p) => p.esOferta)

describe('Página Ofertas', () => {
  it('muestra solo los productos en oferta', async () => {
    await renderConProveedores(<Ofertas />, { ruta: '/ofertas' })

    expect(screen.getByRole('heading', { name: 'Ofertas Especiales' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(enOferta.length)
  })

  it('filtra las ofertas por marca', async () => {
    const marca = enOferta[0].marca
    const deEsaMarca = enOferta.filter((p) => p.marca === marca)
    await renderConProveedores(<Ofertas />, { ruta: '/ofertas' })

    await userEvent.click(screen.getByLabelText(marca))
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }))

    expect(screen.getAllByRole('article')).toHaveLength(deEsaMarca.length)
  })
})