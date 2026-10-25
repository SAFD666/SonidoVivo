// "Base de datos" simulada de productos, guardada en localStorage
import { productos as productosIniciales } from '../data/productos'

const CLAVE = 'sv_productos'
const CLAVE_VERSION = 'sv_productos_version'

// Sube este numero cada vez que modifiques data/productos.js
const VERSION_PRODUCTOS = '2'

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista))
}

// LEER: todos los productos
export function listarProductos() {
  if (localStorage.getItem(CLAVE_VERSION) !== VERSION_PRODUCTOS) {
    localStorage.setItem(CLAVE_VERSION, VERSION_PRODUCTOS)
    guardar(productosIniciales)
    return productosIniciales
  }
  const guardados = localStorage.getItem(CLAVE)
  return guardados ? JSON.parse(guardados) : productosIniciales
}

// LEER: un producto por su código
export function obtenerProducto(codigo) {
  return listarProductos().find((p) => p.codigo === codigo)
}

// CREAR
export function crearProducto(producto) {
  const lista = listarProductos()
  if (lista.some((p) => p.codigo === producto.codigo)) {
    throw new Error('Ya existe un producto con ese código')
  }
  const nuevaLista = [{ ...producto, id: producto.codigo }, ...lista]
  guardar(nuevaLista)
  return nuevaLista
}

// ACTUALIZAR
export function actualizarProducto(codigo, cambios) {
  const lista = listarProductos()
  if (!lista.some((p) => p.codigo === codigo)) {
    throw new Error('No existe un producto con ese código')
  }
  const nuevaLista = lista.map((p) => (p.codigo === codigo ? { ...p, ...cambios } : p))
  guardar(nuevaLista)
  return nuevaLista
}

// ELIMINAR
export function eliminarProducto(codigo) {
  const nuevaLista = listarProductos().filter((p) => p.codigo !== codigo)
  guardar(nuevaLista)
  return nuevaLista
}