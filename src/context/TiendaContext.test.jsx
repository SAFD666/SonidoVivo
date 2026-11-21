import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TiendaProvider, useTienda } from './TiendaContext'
import { esperarCargas } from '../test/renderConProveedores'
import { guardarToken } from '../services/api'

// Usa el contexto real con la API falsa y espera a que cargue el catálogo
async function usarTienda() {
  const hook = renderHook(() => useTienda(), { wrapper: TiendaProvider })
  await esperarCargas()
  return hook
}

const buscar = (result, codigo) => result.current.productos.find((p) => p.codigo === codigo)

async function entrar(result, correo, password) {
  let respuesta
  await act(async () => { respuesta = await result.current.iniciarSesion(correo, password) })
  await esperarCargas() // pedidos y usuarios del rol
  return respuesta
}

describe('TiendaContext', () => {
  // ---------- Catálogo ----------
  it('carga el catálogo desde la API al iniciar', async () => {
    const { result } = await usarTienda()

    expect(result.current.cargandoCatalogo).toBe(false)
    expect(result.current.productos.length).toBeGreaterThan(0)
    expect(result.current.categorias.length).toBeGreaterThan(0)
  })

  // ---------- Sesión ----------
  it('inicia sesión con un correo y contraseña correctos', async () => {
    const { result } = await usarTienda()

    const respuesta = await entrar(result, 'cliente@correo.cl', 'cliente123')

    expect(respuesta.exito).toBe(true)
    expect(result.current.usuarioActivo.nombre).toBe('Cliente Prueba')
    expect(sessionStorage.getItem('sv_token')).toBe('token-3')
  })

  it('rechaza una contraseña incorrecta', async () => {
    const { result } = await usarTienda()

    const respuesta = await entrar(result, 'cliente@correo.cl', 'equivocada')

    expect(respuesta.exito).toBe(false)
    expect(respuesta.mensaje).toBe('Correo o contraseña incorrectos.')
    expect(result.current.usuarioActivo).toBeNull()
  })

  it('no permite registrar un correo que ya existe', async () => {
    const { result } = await usarTienda()

    let respuesta
    await act(async () => { respuesta = await result.current.registrarUsuario('Otro Cliente', 'cliente@correo.cl', 'clave123') })

    expect(respuesta.exito).toBe(false)
    expect(respuesta.mensaje).toBe('Este correo ya está registrado.')
  })

  it('recupera la sesión guardada al recargar (GET /auth/me)', async () => {
    guardarToken('token-1') // como si ya hubiera un token en sessionStorage
    const { result } = await usarTienda()

    expect(result.current.cargandoSesion).toBe(false)
    expect(result.current.usuarioActivo.rol).toBe('Administrador')
  })

  // ---------- Carrito ----------
  it('suma las cantidades si se agrega dos veces el mismo producto', async () => {
    const { result } = await usarTienda()
    const guitarra = buscar(result, 'GA001')

    act(() => { result.current.agregarAlCarrito(guitarra, 2) })
    act(() => { result.current.agregarAlCarrito(guitarra, 1) })

    expect(result.current.carrito).toHaveLength(1)
    expect(result.current.cantidadTotalItems).toBe(3)
    expect(result.current.totalCarrito).toBe(guitarra.precio * 3)
  })

  it('no deja que el carrito supere el stock del producto', async () => {
    const { result } = await usarTienda()
    const guitarra = buscar(result, 'GA001')

    act(() => { result.current.agregarAlCarrito(guitarra, 6) })
    act(() => { result.current.agregarAlCarrito(guitarra, 6) })

    expect(result.current.carrito[0].cantidad).toBe(guitarra.stock)
  })

  it('no deja bajar la cantidad del carrito de 1', async () => {
    const { result } = await usarTienda()

    act(() => { result.current.agregarAlCarrito(buscar(result, 'GA001'), 2) })
    act(() => { result.current.cambiarCantidadCarrito('GA001', 0) })

    expect(result.current.carrito[0].cantidad).toBe(1)
  })

  it('al cerrar sesión, borra el token y vacía el carrito', async () => {
    const { result } = await usarTienda()

    await entrar(result, 'cliente@correo.cl', 'cliente123')
    act(() => { result.current.agregarAlCarrito(buscar(result, 'GA001'), 1) })
    act(() => { result.current.cerrarSesion() })

    expect(result.current.usuarioActivo).toBeNull()
    expect(result.current.carrito).toHaveLength(0)
    expect(sessionStorage.getItem('sv_token')).toBeNull()
  })

  // ---------- Pedidos ----------
  it('al crear un pedido, la API descuenta el stock y se vacía el carrito', async () => {
    const { result } = await usarTienda()
    const stockInicial = buscar(result, 'GA001').stock

    await entrar(result, 'cliente@correo.cl', 'cliente123')
    act(() => { result.current.agregarAlCarrito(buscar(result, 'GA001'), 2) })

    let respuesta
    await act(async () => {
      respuesta = await result.current.crearPedido({
        nombre: 'Cliente Prueba',
        telefono: '+56912345678',
        direccion: null,
        tipoEntrega: 'Retiro en Tienda (Viña del Mar)',
        metodoPago: 'Tarjeta de crédito',
      })
    })
    await esperarCargas() // vuelve a leer el catálogo

    expect(respuesta.exito).toBe(true)
    expect(respuesta.pedido.estado).toBe('En preparación')
    expect(result.current.pedidos[0].id).toBe(respuesta.pedido.id)
    expect(buscar(result, 'GA001').stock).toBe(stockInicial - 2)
    expect(result.current.carrito).toHaveLength(0)
  })

  it('el administrador cambia el estado de un pedido', async () => {
    const { result } = await usarTienda()
    await entrar(result, 'admin@sonidovivo.cl', 'admin123')

    await act(async () => { await result.current.cambiarEstadoPedido('PED-1002', 'Enviado') })

    expect(result.current.pedidos.find((p) => p.id === 'PED-1002').estado).toBe('Enviado')
  })

  // ---------- Administración ----------
  it('al editar un usuario sin contraseña, conserva la anterior', async () => {
    const { result } = await usarTienda()
    await entrar(result, 'admin@sonidovivo.cl', 'admin123')
    const clienteActual = result.current.usuarios.find((u) => u.id === 3)

    let respuesta
    await act(async () => { respuesta = await result.current.guardarUsuario({ ...clienteActual, nombre: 'Cliente Editado', password: '' }) })

    expect(respuesta.exito).toBe(true)
    expect(result.current.usuarios.find((u) => u.id === 3).nombre).toBe('Cliente Editado')

    // La contraseña anterior sigue funcionando
    act(() => { result.current.cerrarSesion() })
    const login = await entrar(result, 'cliente@correo.cl', 'cliente123')
    expect(login.exito).toBe(true)
  })

  it('al renombrar una categoría, sus productos se actualizan', async () => {
    const { result } = await usarTienda()
    await entrar(result, 'admin@sonidovivo.cl', 'admin123')

    await act(async () => { await result.current.guardarCategoria('Bajos', { nombre: 'Bajos Eléctricos', imagen: '' }) })
    await esperarCargas()

    expect(result.current.categorias.some((c) => c.nombre === 'Bajos Eléctricos')).toBe(true)
    expect(buscar(result, 'BA001').categoria).toBe('Bajos Eléctricos')
  })
})