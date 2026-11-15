import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TiendaProvider, useTienda } from './TiendaContext'

const usarTienda = () => renderHook(() => useTienda(), { wrapper: TiendaProvider })

// Busca un producto actual del catálogo por su código
const buscar = (result, codigo) => result.current.productos.find((p) => p.codigo === codigo)

describe('TiendaContext', () => {
  // Cada caso parte con el navegador limpio: datos iniciales, sin sesión ni carrito
  beforeEach(() => {
    localStorage.clear()
  })

  // ---------- Sesión ----------
  it('inicia sesión con un correo y contraseña correctos', () => {
    const { result } = usarTienda()

    let respuesta
    act(() => { respuesta = result.current.iniciarSesion('cliente@correo.cl', 'cliente123') })

    expect(respuesta.exito).toBe(true)
    expect(result.current.usuarioActivo.nombre).toBe('Cliente Prueba')
  })

  it('rechaza una contraseña incorrecta', () => {
    const { result } = usarTienda()

    let respuesta
    act(() => { respuesta = result.current.iniciarSesion('cliente@correo.cl', 'equivocada') })

    expect(respuesta.exito).toBe(false)
    expect(respuesta.mensaje).toBe('Correo o contraseña incorrectos.')
    expect(result.current.usuarioActivo).toBeNull()
  })

  it('no permite registrar un correo que ya existe', () => {
    const { result } = usarTienda()

    let respuesta
    act(() => { respuesta = result.current.registrarUsuario('Otro Cliente', 'cliente@correo.cl', 'clave123') })

    expect(respuesta.exito).toBe(false)
    expect(respuesta.mensaje).toBe('Este correo ya está registrado.')
  })

  // ---------- Carrito ----------
  it('suma las cantidades si se agrega dos veces el mismo producto', () => {
    const { result } = usarTienda()
    const guitarra = buscar(result, 'GA001')

    act(() => { result.current.agregarAlCarrito(guitarra, 2) })
    act(() => { result.current.agregarAlCarrito(guitarra, 1) })

    expect(result.current.carrito).toHaveLength(1)
    expect(result.current.cantidadTotalItems).toBe(3)
    expect(result.current.totalCarrito).toBe(guitarra.precio * 3)
  })

  it('no deja que el carrito supere el stock del producto', () => {
    const { result } = usarTienda()
    const guitarra = buscar(result, 'GA001') // stock inicial: 8

    act(() => { result.current.agregarAlCarrito(guitarra, 6) })
    act(() => { result.current.agregarAlCarrito(guitarra, 6) })

    expect(result.current.carrito[0].cantidad).toBe(guitarra.stock)
  })

  it('no deja bajar la cantidad del carrito de 1', () => {
    const { result } = usarTienda()
    const guitarra = buscar(result, 'GA001')

    act(() => { result.current.agregarAlCarrito(guitarra, 2) })
    act(() => { result.current.cambiarCantidadCarrito('GA001', 0) })

    expect(result.current.carrito[0].cantidad).toBe(1)
  })

  it('al cerrar sesión, vacía el carrito', () => {
    const { result } = usarTienda()

    act(() => { result.current.iniciarSesion('cliente@correo.cl', 'cliente123') })
    act(() => { result.current.agregarAlCarrito(buscar(result, 'GA001'), 1) })
    act(() => { result.current.cerrarSesion() })

    expect(result.current.usuarioActivo).toBeNull()
    expect(result.current.carrito).toHaveLength(0)
  })

  // ---------- Pedidos ----------
  it('al crear un pedido, descuenta el stock y vacía el carrito', () => {
    const { result } = usarTienda()
    const stockInicial = buscar(result, 'GA001').stock

    act(() => { result.current.iniciarSesion('cliente@correo.cl', 'cliente123') })
    act(() => { result.current.agregarAlCarrito(buscar(result, 'GA001'), 2) })

    let pedido
    act(() => {
      pedido = result.current.crearPedido({
        nombre: 'Cliente Prueba',
        direccion: 'Av. Libertad 450',
        telefono: '+56912345678',
        tipoEntrega: 'Despacho Starken',
      })
    })

    expect(pedido.estado).toBe('En preparación')
    expect(pedido.clienteCorreo).toBe('cliente@correo.cl')
    expect(result.current.pedidos[0].id).toBe(pedido.id)
    expect(buscar(result, 'GA001').stock).toBe(stockInicial - 2)
    expect(result.current.carrito).toHaveLength(0)
  })

  it('cambia el estado de un pedido', () => {
    const { result } = usarTienda()

    act(() => { result.current.cambiarEstadoPedido('PED-1001', 'Cancelado') })

    const pedido = result.current.pedidos.find((p) => p.id === 'PED-1001')
    expect(pedido.estado).toBe('Cancelado')
  })

  // ---------- Administración ----------
  it('al editar un usuario sin contraseña, conserva la anterior', () => {
    const { result } = usarTienda()
    const cliente = result.current.usuarios.find((u) => u.id === 3)

    act(() => { result.current.guardarUsuario({ ...cliente, nombre: 'Cliente Editado', password: '' }) })

    const editado = result.current.usuarios.find((u) => u.id === 3)
    expect(editado.nombre).toBe('Cliente Editado')
    expect(editado.password).toBe('cliente123')
  })

  it('al renombrar una categoría, sus productos se actualizan', () => {
    const { result } = usarTienda()

    act(() => { result.current.guardarCategoria('Bajos', { nombre: 'Bajos Eléctricos', imagen: '' }) })

    expect(result.current.categorias.some((c) => c.nombre === 'Bajos Eléctricos')).toBe(true)
    expect(buscar(result, 'BA001').categoria).toBe('Bajos Eléctricos')
  })
})