import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import CompraExitosa from './CompraExitosa'
import { pedidosIniciales } from '../data/pedidos'
import { renderConProveedores, cliente } from '../test/renderConProveedores'

const pedido = pedidosIniciales[0]

describe('Página CompraExitosa', () => {
  it('muestra el pedido que recibe por location.state', async () => {
    await renderConProveedores(<CompraExitosa />, {
      ruta: { pathname: '/compra-exitosa', state: { pedido } },
      usuario: cliente,
    })

    expect(screen.getByRole('heading', { name: '¡Compra realizada con éxito!' })).toBeInTheDocument()
    expect(screen.getByText(pedido.id)).toBeInTheDocument()
    expect(screen.getByText(pedido.direccion)).toBeInTheDocument()
  })

  it('si se entra directo, sin pedido, muestra el aviso', async () => {
    await renderConProveedores(<CompraExitosa />, { ruta: '/compra-exitosa', usuario: cliente })
    expect(screen.getByText('No hay una compra reciente')).toBeInTheDocument()
  })
})