
// Solo envía código y cantidad de cada producto: el precio y el total los calcula el servidor.
export function crearPedidoRequestDto(datosEntrega, carrito) {
  return {
    nombre: datosEntrega.nombre.trim(),
    telefono: datosEntrega.telefono.replace(/\s/g, ''),
    direccion: datosEntrega.direccion,   // { calle, numero, depto, idComuna } o null si es retiro
    tipoEntrega: datosEntrega.tipoEntrega,
    metodoPago: datosEntrega.metodoPago,
    items: carrito.map((item) => ({ codigo: item.codigo, cantidad: item.cantidad })),
  }
}