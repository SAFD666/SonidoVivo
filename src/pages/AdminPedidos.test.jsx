import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPedidos from './AdminPedidos'
import { pedidosIniciales } from '../data/pedidos'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const abrir = () => renderConProveedores(<AdminPedidos />, { ruta: '/admin/pedidos', usuario: admin })

describe('Página AdminPedidos', () => {
  it('lista todos los pedidos', () => {
    abrir()
    expect(screen.getByText(`Pedidos registrados en la tienda (${pedidosIniciales.length})`)).toBeInTheDocument()
  })

  it('filtra por estado', async () => {
    const entregados = pedidosIniciales.filter((p) => p.estado === 'Entregado')
    abrir()

    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'Entregado')

    expect(screen.getByText(`Pedidos registrados en la tienda (${entregados.length})`)).toBeInTheDocument()
  })

  it('avisa si la búsqueda no encuentra pedidos', async () => {
    abrir()

    await userEvent.type(screen.getByLabelText('Buscar por N°, cliente o correo'), 'no-existe')

    expect(screen.getByText('No hay pedidos que coincidan con los filtros.')).toBeInTheDocument()
  })

  it('cambia el estado de un pedido (Update)', async () => {
    abrir()
    const selector = screen.getByLabelText('Cambiar estado del pedido PED-1002')

    await userEvent.selectOptions(selector, 'Enviado')

    expect(selector).toHaveValue('Enviado')
  })
})