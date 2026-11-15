import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminProductos from './AdminProductos'
import { productos } from '../data/productos'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const total = productos.length
const abrir = (ruta = '/admin/productos') => renderConProveedores(<AdminProductos />, { ruta, usuario: admin })

beforeEach(() => {
  window.scrollTo = vi.fn()
})

describe('Página AdminProductos', () => {
  it('lista todos los productos', () => {
    abrir()
    expect(screen.getByText(`Productos del catálogo (${total})`)).toBeInTheDocument()
  })

  it('el buscador filtra la tabla', async () => {
    abrir()

    await userEvent.type(screen.getByLabelText('Código, nombre, marca, modelo o categoría'), 'GA001')

    expect(screen.getByText('Productos del catálogo (1)')).toBeInTheDocument()
  })

  it('crea un producto nuevo (Create)', async () => {
    abrir()

    await userEvent.click(screen.getByRole('button', { name: '+ Nuevo producto' }))
    await userEvent.type(screen.getByLabelText('Código'), 'ZZ001')
    await userEvent.type(screen.getByLabelText('Nombre'), 'Producto de prueba')
    await userEvent.type(screen.getByLabelText('Marca'), 'Marca Test')
    await userEvent.type(screen.getByLabelText('Precio (CLP)'), '1000')
    await userEvent.type(screen.getByLabelText('Stock (unidades)'), '5')
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('Producto ZZ001 creado correctamente.')).toBeInTheDocument()
    expect(screen.getByText(`Productos del catálogo (${total + 1})`)).toBeInTheDocument()
  })

  it('elimina un producto si se confirma (Delete)', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const primero = [...productos].sort((a, b) => a.codigo.localeCompare(b.codigo))[0]
    abrir()

    await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(window.confirm).toHaveBeenCalled()
    expect(screen.getByText(`Producto ${primero.codigo} eliminado.`)).toBeInTheDocument()
    expect(screen.getByText(`Productos del catálogo (${total - 1})`)).toBeInTheDocument()
  })

  it('si llega con location.state, abre el formulario de edición', () => {
    abrir({ pathname: '/admin/productos', state: { editar: 'GA001' } })
    expect(screen.getByRole('heading', { name: 'Editar producto GA001' })).toBeInTheDocument()
  })
})