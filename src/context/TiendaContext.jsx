import React, { createContext, useContext, useState, useEffect } from 'react';
import { productos as productosBase } from '../data/productos';
import { pedidosIniciales } from '../data/pedidos';
import { usuariosIniciales } from '../data/usuarios';

const TiendaContext = createContext();

export function TiendaProvider({ children }) {
  // 1. Estado de Productos (con persistencia en localStorage)
  const [listaProductos, setListaProductos] = useState(() => {
    const guardados = localStorage.getItem('sv_productos');
    return guardados ? JSON.parse(guardados) : productosBase;
  });

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

  // --- FUNCIONES ADMIN CRUD PRODUCTOS ---
  const guardarProducto = (productoEditado) => {
    setListaProductos((prev) => {
      const existe = prev.some((p) => p.codigo === productoEditado.codigo);
      if (existe) {
        return prev.map((p) =>
          p.codigo === productoEditado.codigo ? { ...p, ...productoEditado } : p
        );
      }
      return [{ ...productoEditado, id: productoEditado.codigo }, ...prev];
    });
  };

  const eliminarProducto = (codigo) => {
    setListaProductos((prev) => prev.filter((p) => p.codigo !== codigo));
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