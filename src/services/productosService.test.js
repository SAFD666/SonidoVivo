import { describe, it, expect, beforeEach } from 'vitest'
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from './ProductosService'
import { productos as productosIniciales } from '../data/productos'

const productoNuevo = {
  codigo: 'GA999',
  nombre: 'Guitarra de prueba',
  marca: 'Yamaha',
  modelo: 'T1',
  categoria: 'Guitarras Acústicas',
  precio: 99990,
  stock: 5,
  imagen: '',
  descripcion: '',
  esOferta: false,
}

describe('productosService (CRUD con localStorage)', () => {
  // Preparación: cada caso parte con el almacenamiento vacío
  beforeEach(() => {
    localStorage.clear()
  })

  it('lista los productos iniciales cuando no hay nada guardado', () => {
    expect(listarProductos()).toHaveLength(productosIniciales.length)
  })

  it('crea un producto y lo deja guardado en localStorage', () => {
    crearProducto(productoNuevo)

    const guardados = JSON.parse(localStorage.getItem('sv_productos'))
    expect(guardados.some((p) => p.codigo === 'GA999')).toBe(true)
  })

  it('no permite crear dos productos con el mismo código', () => {
    expect(() => crearProducto({ ...productoNuevo, codigo: 'GA001' })).toThrow('Ya existe')
  })

  it('actualiza solo los campos indicados', () => {
    actualizarProducto('GA001', { precio: 1000 })

    const producto = listarProductos().find((p) => p.codigo === 'GA001')
    expect(producto.precio).toBe(1000)
    expect(producto.nombre).toBe('Guitarra Acústica Folk')
  })

  it('elimina un producto', () => {
    eliminarProducto('GA001')
    expect(listarProductos().find((p) => p.codigo === 'GA001')).toBeUndefined()
  })
})