import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Navbar from './Navbar'
import { renderConProveedores, cliente, admin } from '../../test/renderConProveedores'

describe('Navbar', () => {
  it('sin sesión muestra Iniciar Sesión y el carrito vacío', async () => {
    await renderConProveedores(<Navbar />)

    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Carrito (0)' })).toBeInTheDocument()
  })

  it('cuenta las unidades del carrito', async () => {
    const carrito = [
      { codigo: 'GA001', nombre: 'Guitarra', precio: 129990, cantidad: 2, stock: 8 },
      { codigo: 'EF001', nombre: 'Pedal', precio: 59990, cantidad: 1, stock: 12 },
    ]
    await renderConProveedores(<Navbar />, { carrito })

    expect(screen.getByRole('button', { name: 'Carrito (3)' })).toBeInTheDocument()
  })

  it('un cliente ve Mis Pedidos y su nombre en Salir', async () => {
    await renderConProveedores(<Navbar />, { usuario: cliente })

    expect(screen.getByRole('button', { name: 'Mis Pedidos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salir (Cliente)' })).toBeInTheDocument()
  })

  it('un administrador ve Panel Admin y no el carrito', async () => {
    await renderConProveedores(<Navbar />, { usuario: admin })

    expect(screen.getByRole('button', { name: 'Panel Admin' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Carrito/ })).not.toBeInTheDocument()
  })
})