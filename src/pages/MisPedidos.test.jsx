import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import MisPedidos from './MisPedidos'
import RutaProtegida from '../components/RutaProtegida'
import { pedidosIniciales } from '../data/pedidos'
import { renderConProveedores, cliente, vendedor } from '../test/renderConProveedores'

// Protegida como en App.jsx: la página se muestra cuando la sesión ya se verificó
const abrir = (usuario) =>
  renderConProveedores(<RutaProtegida><MisPedidos /></RutaProtegida>, { ruta: '/mis-pedidos', usuario })

describe('Página MisPedidos', () => {
  it('muestra solo los pedidos del usuario que inició sesión', async () => {
    const suyos = pedidosIniciales.filter((p) => p.clienteCorreo === cliente.correo)
    await abrir(cliente)

    expect(screen.getByText(`Tienes ${suyos.length} pedidos registrados`)).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(suyos.length)
  })

  it('avisa si el usuario aún no tiene pedidos', async () => {
    await abrir(vendedor)
    expect(screen.getByText('Aún no tienes pedidos')).toBeInTheDocument()
  })
})