import { createContext, useContext, useState, useEffect } from 'react';
import { pedidosIniciales } from '../data/pedidos';
import { usuariosIniciales } from '../data/usuarios';
import { listarProductos, listarCategorias } from '../services/catalogoService';
import * as authService from '../services/authService';
import { obtenerMensajeError, guardarToken, registrarAlVencerSesion } from '../services/api';

const TiendaContext = createContext();

export function TiendaProvider(props) {
  // 1. Catálogo: viene de la API (backend Spring Boot + PostgreSQL)
  const [listaProductos, setListaProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState('');

  const cargarCatalogo = async () => {
    setCargandoCatalogo(true);
    setErrorCatalogo('');
    try {
      const [productos, cats] = await Promise.all([listarProductos(), listarCategorias()]);
      setListaProductos(productos);
      setCategorias(cats);
    } catch (error) {
      setErrorCatalogo(obtenerMensajeError(error));
    } finally {
      setCargandoCatalogo(false);
    }
  };

  useEffect(() => {
    cargarCatalogo();
  }, []);

  // 2. Sesión: el usuario y su token viven SOLO en memoria (Guía 19). Al recargar se vuelve a iniciar sesión.
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [sesionVencida, setSesionVencida] = useState(false);

  // Si la API responde 401 con un token (vencido o inválido), se cierra la sesión y se avisa
  useEffect(() => {
    registrarAlVencerSesion(() => {
      guardarToken(null);
      setUsuarioActivo(null);
      setSesionVencida(true);
    });
  }, []);

  // 3. Carrito (sigue en el navegador)
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('sv_carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  // 4. Pedidos (etapa F3: pasarán a la API)
  const [pedidos, setPedidos] = useState(() => {
    const guardados = localStorage.getItem('sv_pedidos');
    return guardados ? JSON.parse(guardados) : pedidosIniciales;
  });

  // 5. Lista de usuarios del panel admin (etapa F4: pasará a la API)
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('sv_usuarios');
    return guardados ? JSON.parse(guardados) : usuariosIniciales;
  });

  useEffect(() => {
    localStorage.setItem('sv_carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem('sv_pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    localStorage.setItem('sv_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  // --- AUTENTICACIÓN CON LA API ---
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

  // Registra (siempre como Cliente) y luego inicia sesión con los mismos datos
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

  // Administración de usuarios (etapa F4)
  const guardarUsuario = (datos) => {
    const correoRepetido = usuarios.some(
      (u) => u.correo.toLowerCase() === datos.correo.toLowerCase() && u.id !== datos.id
    );
    if (correoRepetido) {
      return { exito: false, mensaje: "Ya existe un usuario con ese correo." };
    }
    const { password, ...resto } = datos;
    const cambios = password ? datos : resto;
    if (datos.id) {
      setUsuarios((prev) => prev.map((u) => (u.id === datos.id ? { ...u, ...cambios } : u)));
      if (usuarioActivo?.id === datos.id) {
        setUsuarioActivo((prev) => ({ ...prev, ...cambios }));
      }
    } else {
      setUsuarios((prev) => [...prev, { ...datos, id: Date.now() }]);
    }
    return { exito: true };
  };

  // --- FUNCIONES DEL CARRITO ---
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

  // --- PEDIDOS (etapa F3) ---
  const crearPedido = (datosEntrega) => {
    const nuevoPedido = {
      id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: new Date().toISOString().split('T')[0],
      clienteCorreo: usuarioActivo ? usuarioActivo.correo : datosEntrega.correo,
      clienteNombre: datosEntrega.nombre,
      direccion: datosEntrega.direccion,
      telefono: datosEntrega.telefono,
      tipoEntrega: datosEntrega.tipoEntrega,
      estado: "En preparación",
      total: totalCarrito,
      items: carrito.map((i) => ({ codigo: i.codigo, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad }))
    };
    setListaProductos((prev) =>
      prev.map((prod) => {
        const itemComprado = carrito.find((c) => c.codigo === prod.codigo);
        return itemComprado ? { ...prod, stock: Math.max(0, prod.stock - itemComprado.cantidad) } : prod;
      })
    );
    setPedidos((prev) => [nuevoPedido, ...prev]);
    vaciarCarrito();
    return nuevoPedido;
  };

  const cambiarEstadoPedido = (idPedido, nuevoEstado) => {
    setPedidos((prev) => prev.map((p) => (p.id === idPedido ? { ...p, estado: nuevoEstado } : p)));
  };

  // --- ADMIN: productos y categorías (etapa F4) ---
  const guardarProducto = (producto) => {
    setListaProductos((prev) =>
      prev.some((p) => p.codigo === producto.codigo)
        ? prev.map((p) => (p.codigo === producto.codigo ? { ...p, ...producto } : p))
        : [{ ...producto, id: producto.codigo }, ...prev]
    );
  };

  const eliminarProducto = (codigo) => {
    setListaProductos((prev) => prev.filter((p) => p.codigo !== codigo));
  };

  const guardarCategoria = (nombreOriginal, datos) => {
    const nombre = datos.nombre.trim();
    const repetida = categorias.some(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.nombre !== nombreOriginal
    );
    if (repetida) {
      return { exito: false, mensaje: "Ya existe una categoría con ese nombre." };
    }
    const categoria = { nombre, imagen: datos.imagen.trim() || "/img/logotipo.jpg" };
    if (nombreOriginal) {
      setCategorias((prev) => prev.map((c) => (c.nombre === nombreOriginal ? { ...c, ...categoria } : c)));
      if (nombreOriginal !== nombre) {
        setListaProductos((prev) =>
          prev.map((p) => (p.categoria === nombreOriginal ? { ...p, categoria: nombre } : p))
        );
      }
    } else {
      setCategorias((prev) => [...prev, categoria]);
    }
    return { exito: true };
  };

  return (
    <TiendaContext.Provider
      value={{
        productos: listaProductos,
        carrito,
        pedidos,
        usuarios,
        categorias,
        usuarioActivo,
        sesionVencida,
        totalCarrito,
        cantidadTotalItems,
        cargandoCatalogo,
        errorCatalogo,
        recargarCatalogo: cargarCatalogo,
        iniciarSesion,
        registrarUsuario,
        cerrarSesion,
        guardarUsuario,
        agregarAlCarrito,
        cambiarCantidadCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        crearPedido,
        cambiarEstadoPedido,
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