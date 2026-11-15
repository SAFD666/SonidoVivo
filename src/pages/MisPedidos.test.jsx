import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import MisPedidos from './MisPedidos'
import { pedidosIniciales } from '../data/pedidos'
import { renderConProveedores, cliente, vendedor } from '../test/renderConProveedores'

describe('Página MisPedidos', () => {
  it('muestra solo los pedidos del usuario que inició sesión', () => {
    const suyos = pedidosIniciales.filter((p) => p.clienteCorreo === cliente.correo)
    renderConProveedores(<MisPedidos />, { usuario: cliente })

    expect(screen.getByText(`Tienes ${suyos.length} pedidos registrados`)).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(suyos.length)
  })

  it('avisa si el usuario aún no tiene pedidos', () => {
    renderConProveedores(<MisPedidos />, { usuario: vendedor })
    expect(screen.getByText('Aún no tienes pedidos')).toBeInTheDocument()
  })
})