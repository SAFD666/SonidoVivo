// API falsa en memoria para las pruebas: imita al backend Spring Boot con los datos de src/data.
// Los services reales (Axios) se reemplazan por estos objetos en setupTests.js, así ninguna prueba
// necesita un servidor. Los errores tienen la misma forma que los de Axios: error.response.data.mensaje.
import { productos as productosBase, generarSlug } from '../data/productos'
import { categoriasIniciales } from '../data/categorias'
import { pedidosIniciales } from '../data/pedidos'
import { usuariosIniciales } from '../data/usuarios'

const copiar = (dato) => JSON.parse(JSON.stringify(dato))

const REGIONES = [
  { id: 6, nombre: 'Valparaíso', comunas: [{ id: 11, nombre: 'Valparaíso' }, { id: 12, nombre: 'Viña del Mar' }] },
  { id: 11, nombre: 'Biobío', comunas: [{ id: 30, nombre: 'Concepción' }] },
]

let estado

export function reiniciarApiFalsa() {
  estado = {
    productos: copiar(productosBase),
    categorias: categoriasIniciales.map((c, i) => ({ id: i + 1, slug: generarSlug(c.nombre), ...c })),
    pedidos: copiar(pedidosIniciales),
    usuarios: copiar(usuariosIniciales),
    ultimoPedido: 2000,
  }
}
reiniciarApiFalsa()

function falla(status, mensaje) {
  const error = new Error(mensaje)
  error.response = { status, data: { mensaje, detalles: [] } }
  return error
}

const responder = (dato) => Promise.resolve(copiar(dato))
const sinPassword = ({ password, ...resto }) => resto

// El "token" de prueba es "token-<id>", guardado en sessionStorage por api.js
function usuarioDelToken() {
  const token = sessionStorage.getItem('sv_token')
  const id = token ? Number(token.replace('token-', '')) : null
  return estado.usuarios.find((u) => u.id === id && u.activo) || null
}

// ---------- catalogoService ----------
export const catalogoFalso = {
  listarProductos: async () => responder(estado.productos),
  obtenerProducto: async (codigo) => {
    const p = estado.productos.find((x) => x.codigo === codigo)
    if (!p) throw falla(404, `Producto ${codigo} no encontrado`)
    return responder(p)
  },
  crearProducto: async (dto) => {
    if (estado.productos.some((p) => p.codigo === dto.codigo)) throw falla(409, 'Ya existe un producto con ese código')
    const nuevo = { ...dto, id: dto.codigo }
    estado.productos.unshift(nuevo)
    return responder(nuevo)
  },
  actualizarProducto: async (codigo, dto) => {
    estado.productos = estado.productos.map((p) => (p.codigo === codigo ? { ...p, ...dto } : p))
    return responder(estado.productos.find((p) => p.codigo === codigo))
  },
  eliminarProducto: async (codigo) => {
    estado.productos = estado.productos.filter((p) => p.codigo !== codigo)
  },
  listarCategorias: async () => responder(estado.categorias),
  crearCategoria: async (dto) => {
    if (estado.categorias.some((c) => c.nombre.toLowerCase() === dto.nombre.toLowerCase())) {
      throw falla(409, 'Ya existe una categoría con ese nombre.')
    }
    const nueva = { id: estado.categorias.length + 1, nombre: dto.nombre, slug: generarSlug(dto.nombre), imagen: dto.imagen || '/img/logotipo.jpg' }
    estado.categorias.push(nueva)
    return responder(nueva)
  },
  actualizarCategoria: async (id, dto) => {
    const actual = estado.categorias.find((c) => c.id === id)
    estado.productos = estado.productos.map((p) => (p.categoria === actual.nombre ? { ...p, categoria: dto.nombre } : p))
    Object.assign(actual, { nombre: dto.nombre, slug: generarSlug(dto.nombre), imagen: dto.imagen || actual.imagen })
    return responder(actual)
  },
  listarMarcas: async () => responder([...new Set(estado.productos.map((p) => p.marca))].map((nombre, i) => ({ id: i + 1, nombre }))),
}

// ---------- authService ----------
export const authFalso = {
  iniciarSesion: async (correo, password) => {
    const u = estado.usuarios.find(
      (x) => x.correo.toLowerCase() === correo.toLowerCase() && x.password === password && x.activo
    )
    if (!u) throw falla(401, 'Correo o contraseña incorrectos.')
    return responder({ accessToken: `token-${u.id}`, tokenType: 'Bearer', expiresIn: 3600, usuario: sinPassword(u) })
  },
  registrar: async (nombre, correo, password) => {
    if (estado.usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase())) {
      throw falla(409, 'Este correo ya está registrado.')
    }
    const nuevo = { id: Math.max(...estado.usuarios.map((u) => u.id)) + 1, nombre, correo, password, rol: 'Cliente', activo: true }
    estado.usuarios.push(nuevo)
    return responder(sinPassword(nuevo))
  },
  obtenerMiPerfil: async () => {
    const u = usuarioDelToken()
    if (!u) throw falla(401, 'Sesión no válida')
    return responder(sinPassword(u))
  },
}

// ---------- pedidoService ----------
export const pedidoFalso = {
  obtenerOpciones: async () => responder({
    tiposEntrega: ['Retiro en Tienda (Viña del Mar)', 'Despacho Starken', 'Despacho Chilexpress'],
    metodosPago: ['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia bancaria'],
    estados: ['En preparación', 'Enviado', 'Entregado', 'Cancelado'],
  }),
  listarRegiones: async () => responder(REGIONES),
  listarPedidos: async () => {
    const u = usuarioDelToken()
    if (!u) throw falla(401, 'Sesión no válida')
    return responder(u.rol === 'Cliente' ? estado.pedidos.filter((p) => p.clienteCorreo === u.correo) : estado.pedidos)
  },
  crearPedido: async (dto) => {
    const u = usuarioDelToken()
    if (!u) throw falla(401, 'Sesión no válida')
    // Regla de negocio: no se vende más que el stock (409)
    for (const item of dto.items) {
      const p = estado.productos.find((x) => x.codigo === item.codigo)
      if (item.cantidad > p.stock) throw falla(409, `No hay stock suficiente de "${p.nombre}".`)
    }
    const items = dto.items.map((item) => {
      const p = estado.productos.find((x) => x.codigo === item.codigo)
      p.stock -= item.cantidad
      return { codigo: p.codigo, nombre: p.nombre, precio: p.precio, cantidad: item.cantidad }
    })
    const comuna = REGIONES.flatMap((r) => r.comunas).find((c) => c.id === dto.direccion?.idComuna)
    const pedido = {
      id: `PED-${++estado.ultimoPedido}`,
      fecha: '2026-11-22',
      clienteCorreo: u.correo,
      clienteNombre: dto.nombre,
      telefono: dto.telefono,
      direccion: dto.direccion ? `${dto.direccion.calle} ${dto.direccion.numero}, ${comuna?.nombre}` : 'Retiro en tienda',
      tipoEntrega: dto.tipoEntrega,
      metodoPago: dto.metodoPago,
      estado: 'En preparación',
      total: items.reduce((suma, i) => suma + i.precio * i.cantidad, 0),
      items,
    }
    estado.pedidos.unshift(pedido)
    return responder(pedido)
  },
  cambiarEstado: async (codigo, nuevoEstado) => {
    const pedido = estado.pedidos.find((p) => p.id === codigo)
    if (pedido.estado === 'Cancelado') throw falla(409, 'Un pedido cancelado no puede cambiar de estado')
    pedido.estado = nuevoEstado
    return responder(pedido)
  },
}

// ---------- usuarioService ----------
export const usuarioFalso = {
  listarUsuarios: async () => responder(estado.usuarios.map(sinPassword)),
  crearUsuario: async (dto) => {
    if (estado.usuarios.some((u) => u.correo.toLowerCase() === dto.correo.toLowerCase())) {
      throw falla(409, 'Ya existe un usuario con ese correo.')
    }
    const nuevo = { ...dto, id: Math.max(...estado.usuarios.map((u) => u.id)) + 1, activo: dto.activo ?? true }
    estado.usuarios.push(nuevo)
    return responder(sinPassword(nuevo))
  },
  actualizarUsuario: async (id, dto) => {
    if (estado.usuarios.some((u) => u.id !== id && u.correo.toLowerCase() === dto.correo.toLowerCase())) {
      throw falla(409, 'Ya existe un usuario con ese correo.')
    }
    const u = estado.usuarios.find((x) => x.id === id)
    Object.assign(u, { nombre: dto.nombre, correo: dto.correo, rol: dto.rol, activo: dto.activo })
    if (dto.password) u.password = dto.password // contraseña vacía = se mantiene
    return responder(sinPassword(u))
  },
}