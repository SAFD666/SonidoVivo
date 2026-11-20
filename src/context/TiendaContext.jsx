import { createContext, useContext, useState, useEffect } from 'react';
import { pedidosIniciales } from '../data/pedidos';
import { usuariosIniciales } from '../data/usuarios';
import { listarProductos, listarCategorias } from '../services/catalogoService';
import { obtenerMensajeError } from '../services/api';

const TiendaContext = createContext();

export function TiendaProvider(props) {
  // 1. Catálogo: ahora viene de la API (backend Spring Boot + PostgreSQL)
  const [listaProductos, setListaProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState('');

  const cargarCatalogo = async () => {
    setCargandoCatalogo(true);
    setErrorCatalogo('');
    try {
      // Las dos peticiones salen al mismo tiempo
      const [productos, cats] = await Promise.all([listarProductos(), listarCategorias()]);
      setListaProductos(productos);
      setCategorias(cats);
    } catch (error) {
      setErrorCatalogo(obtenerMensajeError(error));
    } finally {
      setCargandoCatalogo(false);
    }
  };

  // Se pide el catálogo una vez, cuando la aplicación aparece en pantalla
  useEffect(() => {
    cargarCatalogo();
  }, []);

  // 2. Estado del Carrito (sigue en el navegador)
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('sv_carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  // 3. Estado de Pedidos (etapa F3: pasará a la API)
  const [pedidos, setPedidos] = useState(() => {
    const guardados = localStorage.getItem('sv_pedidos');
    return guardados ? JSON.parse(guardados) : pedidosIniciales;
  });

  // 4. Usuarios y Usuario Activo (etapa F2: pasará a la API)
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('sv_usuarios');
    return guardados ? JSON.parse(guardados) : usuariosIniciales;
  });

  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const guardado = localStorage.getItem('sv_usuario_activo');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Sincronización con localStorage (solo lo que todavía no está en la API)
  useEffect(() => {
    localStorage.setItem('sv_carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem('sv_pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  useEffect(() => {
    localStorage.setItem('sv_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (usuarioActivo) {
      localStorage.setItem('sv_usuario_activo', JSON.stringify(usuarioActivo));
    } else {
      localStorage.removeItem('sv_usuario_activo');
    }
  }, [usuarioActivo]);

  // --- FUNCIONES DE AUTENTICACIÓN (etapa F2) ---
  const iniciarSesion = (correo, password) => {
    const user = usuarios.find(
      (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password && u.activo
    );
    if (user) {
      setUsuarioActivo(user);
      return { exito: true, usuario: user };
    }
    return { exito: false, mensaje: "Correo o contraseña incorrectos." };
  };

  const registrarUsuario = (nombre, correo, password) => {
    const existe = usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (existe) {
      return { exito: false, mensaje: "Este correo ya está registrado." };
    }
    const nuevoUsuario = { id: Date.now(), nombre, correo, password, rol: "Cliente", activo: true };
    setUsuarios([...usuarios, nuevoUsuario]);
    setUsuarioActivo(nuevoUsuario);
    return { exito: true, usuario: nuevoUsuario };
  };

  const cerrarSesion = () => {
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

  // --- PEDIDOS (etapa F3: el backend calculará el total y descontará el stock) ---
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

  // --- ADMIN: productos y categorías (etapa F4: pasarán a la API; por ahora solo cambian en pantalla) ---
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