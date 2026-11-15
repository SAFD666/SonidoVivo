import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import AdminReportes from './AdminReportes'
import { pedidosIniciales } from '../data/pedidos'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const abrir = () => renderConProveedores(<AdminReportes />, { ruta: '/admin/reportes', usuario: admin })

describe('Página AdminReportes', () => {
  it('muestra las tres secciones del reporte', () => {
    abrir()

    expect(screen.getByRole('heading', { level: 1, name: 'Reportes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pedidos por estado' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ventas por categoría' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument()
  })

  it('los productos vendidos aparecen en el ranking', () => {
    const codigosVendidos = pedidosIniciales
      .filter((p) => p.estado !== 'Cancelado')
      .flatMap((p) => p.items.map((item) => item.codigo))
    abrir()

    codigosVendidos.forEach((codigo) => {
      expect(screen.getByText(codigo)).toBeInTheDocument()
    })
  })
})