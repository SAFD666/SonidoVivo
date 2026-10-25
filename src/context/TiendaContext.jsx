import React, { createContext, useContext, useState, useEffect } from 'react';
import { pedidosIniciales } from '../data/pedidos';
import { usuariosIniciales } from '../data/usuarios';
import * as productosService from '../services/ProductosService';

const TiendaContext = createContext();

export function TiendaProvider({ children }) {
  
  // 1. Estado de Productos (los datos los entrega el servicio)
  const [listaProductos, setListaProductos] = useState(() => productosService.listarProductos());

  // 2. Estado del Carrito
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('sv_carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  // 3. Estado de Pedidos
  const [pedidos, setPedidos] = useState(() => {
    const guardados = localStorage.getItem('sv_pedidos');
    return guardados ? JSON.parse(guardados) : pedidosIniciales;
  });

  // 4. Estado de Usuarios y Usuario Activo
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('sv_usuarios');
    return guardados ? JSON.parse(guardados) : usuariosIniciales;
  });

  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const guardado = localStorage.getItem('sv_usuario_activo');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Sincronización con localStorage
  useEffect(() => {
    localStorage.setItem('sv_productos', JSON.stringify(listaProductos));
  }, [listaProductos]);

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

  // --- FUNCIONES DE AUTENTICACIÓN ---
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
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      correo,
      password,
      rol: "Cliente",
      activo: true
    };
    setUsuarios([...usuarios, nuevoUsuario]);
    setUsuarioActivo(nuevoUsuario);
    return { exito: true, usuario: nuevoUsuario };
  };

    const cerrarSesion = () => {
    setUsuarioActivo(null);
    setCarrito([]);
  };
    // administracion de usuarios
  const guardarUsuario = (datos) => {
    const correoRepetido = usuarios.some(
      (u) => u.correo.toLowerCase() === datos.correo.toLowerCase() && u.id !== datos.id
    );
    if (correoRepetido) {
      return { exito: false, mensaje: "Ya existe un usuario con ese correo." };
    }

    // Si la contraseña viene vacía (al editar), se conserva la actual
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

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const cantidadTotalItems = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  // --- FUNCIONES DE PEDIDOS Y DESCUENTO AUTOMÁTICO DE STOCK ---
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
      items: carrito.map((i) => ({
        codigo: i.codigo,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad
      }))
    };

    // Descontar stock automáticamente de listaProductos
    setListaProductos((prevProductos) =>
      prevProductos.map((prod) => {
        const itemComprado = carrito.find((c) => c.codigo === prod.codigo);
        if (itemComprado) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - itemComprado.cantidad)
          };
        }
        return prod;
      })
    );

    setPedidos((prev) => [nuevoPedido, ...prev]);
    vaciarCarrito();
    return nuevoPedido;
  };

  const cambiarEstadoPedido = (idPedido, nuevoEstado) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === idPedido ? { ...p, estado: nuevoEstado } : p))
    );
  };

  
  //  FUNCIONES ADMIN CRUD PRODUCTOS (usando ahora el servicio) 
  const guardarProducto = (producto) => {
    const existe = listaProductos.some((p) => p.codigo === producto.codigo);
    const nuevaLista = existe
      ? productosService.actualizarProducto(producto.codigo, producto)
      : productosService.crearProducto(producto);
    setListaProductos(nuevaLista);
  };

  const eliminarProducto = (codigo) => {
    setListaProductos(productosService.eliminarProducto(codigo));
  };


  return (
    <TiendaContext.Provider
      value={{
        productos: listaProductos,
        carrito,
        pedidos,
        usuarios,
        usuarioActivo,
        totalCarrito,
        cantidadTotalItems,
        iniciarSesion,
        registrarUsuario,
        cerrarSesion,
        agregarAlCarrito,
        cambiarCantidadCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        crearPedido,
        cambiarEstadoPedido,
        guardarProducto,
        eliminarProducto
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
}

export const useTienda = () => useContext(TiendaContext);