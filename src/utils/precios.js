
export function formatearPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-CL')
}

export function calcularTotal(items) {
  return items.reduce((total, item) => total + item.precio + item.cantidad, 0)
}


export function contarUnidades(items) {
  return items.reduce((total, item) => total + item.cantidad, 0)
}

export const STOCK_CRITICO = 3