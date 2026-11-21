import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminProductos from './AdminProductos'
import { productos } from '../data/productos'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const total = productos.length
const abrir = () => renderConProveedores(<AdminProductos />, { ruta: '/admin/productos', usuario: admin })

beforeEach(() => {
  window.scrollTo = vi.fn()
})

describe('Página AdminProductos', () => {
  it('lista todos los productos', async () => {
    await abrir()
    expect(screen.getByText(`Productos del catálogo (${total})`)).toBeInTheDocument()
  })

  it('el buscador filtra la tabla', async () => {
    await abrir()

    await userEvent.type(screen.getByLabelText('Código, nombre, marca, modelo o categoría'), 'GA001')

    expect(screen.getByText('Productos del catálogo (1)')).toBeInTheDocument()
  })

  it('crea un producto nuevo (POST /productos)', async () => {
    await abrir()

    await userEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }))
    await userEvent.type(screen.getByLabelText('Código'), 'ZZ001')
    await userEvent.type(screen.getByLabelText('Nombre'), 'Producto de prueba')
    await userEvent.type(screen.getByLabelText('Marca'), 'Marca Test')
    await userEvent.type(screen.getByLabelText('Precio (CLP)'), '1000')
    await userEvent.type(screen.getByLabelText('Stock (unidades)'), '5')
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(await screen.findByText('Producto ZZ001 creado correctamente.')).toBeInTheDocument()
    expect(screen.getByText(`Productos del catálogo (${total + 1})`)).toBeInTheDocument()
  })

  it('elimina un producto después de confirmar en la ventana (DELETE /productos)', async () => {
    const primero = [...productos].sort((a, b) => a.codigo.localeCompare(b.codigo))[0]
    await abrir()

    await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    const ventana = await screen.findByRole('dialog')
    await userEvent.click(within(ventana).getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText(`Producto ${primero.codigo} eliminado.`)).toBeInTheDocument()
    expect(screen.getByText(`Productos del catálogo (${total - 1})`)).toBeInTheDocument()
  })
})