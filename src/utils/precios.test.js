import { describe, it, expect } from 'vitest'
import { formatearPrecio, calcularTotal, contarUnidades } from './precios'

describe('formatearPrecio', () => {
  it('agrega $ y separador de miles', () => {
    expect(formatearPrecio(129990)).toBe('$129.990')
  })

  it('formatea el cero', () => {
    expect(formatearPrecio(0)).toBe('$0')
  })
})

describe('calcularTotal', () => {
  it('suma precio por cantidad', () => {
    const carrito = [
      { precio: 1000, cantidad: 2 },
      { precio: 500, cantidad: 1 },
    ]
    expect(calcularTotal(carrito)).toBe(2500)
  })

  it('devuelve 0 con el carrito vacío', () => {
    expect(calcularTotal([])).toBe(0)
  })
})

describe('contarUnidades', () => {
  it('suma las cantidades', () => {
    const carrito = [{ cantidad: 2 }, { cantidad: 1 }]
    expect(contarUnidades(carrito)).toBe(3)
  })

  it('devuelve 0 con el carrito vacío', () => {
    expect(contarUnidades([])).toBe(0)
  })
})