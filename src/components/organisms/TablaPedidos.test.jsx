import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import TablaPedidos from './TablaPedidos'

const pedidos = [
  {
    id: 'PED-1001', fecha: '2026-10-10', clienteNombre: 'Cliente Prueba', clienteCorreo: 'cliente@correo.cl',
    tipoEntrega: 'Retiro en Tienda (Viña del Mar)', direccion: 'Av. Libertad 450', total: 129990, estado: 'Entregado',
    items: [{ codigo: 'GA001', nombre: 'Guitarra Acústica Folk', precio: 129990, cantidad: 1 }],
  },
  {
    id: 'PED-1002', fecha: '2026-10-13', clienteNombre: 'Cliente Prueba', clienteCorreo: 'cliente@correo.cl',
    tipoEntrega: 'Despacho Starken', direccion: "O'Higgins 820", total: 309980, estado: 'En preparación',
    items: [{ codigo: 'EF001', nombre: 'Pedal Distorsión Clásico', precio: 59990, cantidad: 1 }],
  },
]

const dibujar = (alCambiar = () => {}) =>
  render(
    <MemoryRouter>
      <TablaPedidos pedidos={pedidos} onCambiarEstado={alCambiar} />
    </MemoryRouter>
  )

describe('TablaPedidos', () => {
  it('muestra una fila por pedido y el total en el título', () => {
    dibujar()
    expect(screen.getByText('Pedidos registrados en la tienda (2)')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3) // encabezado + 2 pedidos
  })

  it('el número de pedido enlaza a su comprobante', () => {
    dibujar()
    expect(screen.getByRole('link', { name: 'PED-1001' })).toHaveAttribute('href', '/admin/pedidos/PED-1001')
  })

  it('al cambiar el estado, avisa el pedido y el estado nuevo', async () => {
    const alCambiar = vi.fn()
    dibujar(alCambiar)

    await userEvent.selectOptions(screen.getByLabelText('Cambiar estado del pedido PED-1002'), 'Enviado')

    expect(alCambiar).toHaveBeenCalledWith('PED-1002', 'Enviado')
  })
})