import { createContext, useContext, useState, useEffect } from 'react';
import * as catalogoService from '../services/catalogoService';
import * as authService from '../services/authService';
import * as pedidoService from '../services/pedidoService';
import * as usuarioService from '../services/usuarioService';
import { crearPedidoRequestDto } from '../dto/pedido.dto';
import { crearProductoRequestDto } from '../dto/producto.dto';
import { obtenerMensajeError, guardarToken, obtenerToken, registrarAlVencerSesion } from '../services/api';

const TiendaContext = createContext();

export function TiendaProvider(props) {
  // ===== 1. CATÁLOGO (público) =====
  const [listaProductos, setListaProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState('');

  const cargarCatalogo = async () => {
    setCargandoCatalogo(true);
    setErrorCatalogo('');
    try {
      const [productos, cats] = await Promise.all([
        catalogoService.listarProductos(),
        catalogoService.listarCategorias(),
      ]);
      setListaProductos(productos);
      setCategorias(cats);
    } catch (error) {
      setErrorCatalogo(obtenerMensajeError(error));
    } finally {
      setCargandoCatalogo(false);
    }
  };

  // ===== 2. SESIÓN =====
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [sesionVencida, setSesionVencida] = useState(false);
  // Si hay un token guardado, al abrir la página se verifica con el backend antes de mostrar rutas protegidas
  const [cargandoSesion, setCargandoSesion] = useState(Boolean(obtenerToken()));

  useEffect(() => {
    cargarCatalogo();

    // 401 con token: sesión vencida o inválida
    registrarAlVencerSesion(() => {
      guardarToken(null);
      setUsuarioActivo(null);
      setSesionVencida(true);
    });

    // Recarga de página: se recupera el usuario dueño del token guardado (GET /auth/me)
    if (obtenerToken()) {
      authService.obtenerMiPerfil()
        .then((usuario) => setUsuarioActivo(usuario))
        .catch(() => guardarToken(null))
        .finally(() => setCargandoSesion(false));
    }
  }, []);

  const iniciarSesion = async (correo, password) => {
    try {
      const respuesta = await authService.iniciarSesion(correo, password);
      guardarToken(respuesta.accessToken);
      setUsuarioActivo(respuesta.usuario);
      setSesionVencida(false);
      return { exito: true, usuario: respuesta.usuario };
    } catch (error) {
      return { exito: false, mensaje: obtenerMensajeError(error) };
    }
  };

  const registrarUsuario = async (nombre, correo, password) => {
    try {
      await authService.registrar(nombre, correo, password);
      return await iniciarSesion(correo, password);
    } catch (error) {
      return { exito: false, mensaje: obtenerMensajeError(error) };
    }
  };

  const cerrarSesion = () => {
    guardarToken(null);
    setUsuarioActivo(null);
    setCarrito([]);
  };

  // ===== 3. CARRITO (en el navegador) =====
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('sv_carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('sv_carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.codigo === producto.codigo);
      if (existe) {
        const nuevaCantidad = Math.min(existe.cantidad + cantidad, producto.stock);
        return prev.map((item) =>
          item.codigo === producto.codigo ? { ...item, cantidad: nuevaCantidad } : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const cambiarCantidadCarrito = (codigo, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.codigo === codigo
          ? { ...item, cantidad: Math.max(1, Math.min(nuevaCantidad, item.stock)) }
          : item
      )
    );
  };

  const eliminarDelCarrito = (codigo) => {
    setCarrito((prev) => prev.filter((item) => item.codigo !== codigo));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const cantidadTotalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // ===== 4. PEDIDOS (cliente: los suyos; admin/vendedor: todos) =====
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = async () => {
    try {
      setPedidos(await pedidoService.listarPedidos());
    } catch {
      setPedidos([]);
    }
  };

  const crearPedido = async (datosEntrega) => {
    try {
      const pedido = await pedidoService.crearPedido(crearPedidoRequestDto(datosEntrega, carrito));
      setPedidos((prev) => [pedido, ...prev]);
      vaciarCarrito();
      cargarCatalogo(); // stock actualizado
      return { exito: true, pedido };
    } catch (error) {
      return { exito: false, mensaje: obtenerMensajeError(error) };
    }
  };

  const cambiarEstadoPedido = async (codigo, nuevoEstado) => {
    try {
      const actualizado = await pedidoService.cambiarEstado(codigo, nuevoEstado);
      setPedidos((prev) => prev.map((p) => (p.id === codigo ? actualizado : p)));
      if (nuevoEstado === "Cancelado") cargarCatalogo(); // el servidor devolvió el stock
    } catch (error) {
      alert(obtenerMensajeError(error));
      cargarPedidos();
    }
  };

  // ===== 5. USUARIOS (solo Administrador) =====
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    try {
      setUsuarios(await usuarioService.listarUsuarios());
    } catch {
      setUsuarios([]);
    }
  };

  // Crear (sin id) o editar (con id). Contraseña vacía al editar = se mantiene la actual.
  const guardarUsuario = async (datos) => {
    try {
      const dto = {
        nombre: datos.nombre,
        correo: datos.correo,
        password: datos.password ? datos.password : null,
        rol: datos.rol,
        activo: datos.activo,
      };
      const guardado = datos.id
        ? await usuarioService.actualizarUsuario(datos.id, dto)
        : await usuarioService.crearUsuario(dto);

      setUsuarios((prev) =>
        prev.some((u) => u.id === guardado.id)
          ? prev.map((u) => (u.id === guardado.id ? guardado : u))
          : [...prev, guardado]
      );
      if (usuarioActivo?.id === guardado.id) {
        setUsuarioActivo(guardado);
      }
      return { exito: true, usuario: guardado };
    } catch (error) {
      return { exito: false, mensaje: obtenerMensajeError(error) };
    }
  };

  // Al cambiar de usuario se cargan sus datos protegidos
  useEffect(() => {
    if (usuarioActivo) {
      cargarPedidos();
      if (usuarioActivo.rol === "Administrador") cargarUsuarios();
    } else {
      setPedidos([]);
      setUsuarios([]);
    }
  }, [usuarioActivo?.id]);

  // ===== 6. ADMIN: PRODUCTOS Y CATEGORÍAS (Administrador o Vendedor) =====
  const guardarProducto = async (producto, esEdicion) => {
    try {
      const dto = crearProductoRequestDto(producto);
      const guardado = esEdicion
        ? await catalogoService.actualizarProducto(dto.codigo, dto)
        : await catalogoService.crearProducto(dto);
      setListaProductos((prev) =>
        esEdicion ? prev.map((p) => (p.codigo === guardado.codigo ? guardado : p)) : [guardado, ...prev]
      );
      return { exito: true, producto: guardado };
    } catch (error) {
      return { exito: false, mensaje: obtenerMensajeError(error) };
    }
  };

  const eliminarProducto = async (codigo) => {
    try {
      await catalogoService.eliminarProducto(codigo);
      setListaProductos((prev) => prev.filter((p) => p.codigo !== codigo));
      return { exito: true };
    } catch (error) {
      return { exito: false, mensaje: obtenerMensajeError(error) };
    }
  };

  // nombreOriginal = null → nueva; con nombre → editar esa categoría
  const guardarCategoria = async (nombreOriginal, datos) => {
    try {
      const dto = { nombre: datos.nombre.trim(), imagen: datos.imagen.trim() || null };
      if (nombreOriginal) {
        const actual = categorias.find((c) => c.nombre === nombreOriginal);
        await catalogoService.actualizarCategoria(actual.id, dto);
      } else {
        await catalogoService.crearCategoria(dto);
      }
      await cargarCatalogo(); // si se renombró, los productos ya vienen con el nombre nuevo
      return { exito: true };
    } catch (error) {
      return { exito: false, mensaje: obtenerMensajeError(error) };
    }
  };

  return (
    <TiendaContext.Provider
      value={{
        productos: listaProductos,
        categorias,
        cargandoCatalogo,
        errorCatalogo,
        recargarCatalogo: cargarCatalogo,
        usuarioActivo,
        cargandoSesion,
        sesionVencida,
        iniciarSesion,
        registrarUsuario,
        cerrarSesion,
        carrito,
        totalCarrito,
        cantidadTotalItems,
        agregarAlCarrito,
        cambiarCantidadCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        pedidos,
        crearPedido,
        cambiarEstadoPedido,
        usuarios,
        guardarUsuario,
        guardarProducto,
        eliminarProducto,
        guardarCategoria
      }}
    >
      {props.children}
    </TiendaContext.Provider>
  );
}

export const useTienda = () => useContext(TiendaContext);