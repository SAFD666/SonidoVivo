import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioProducto from './FormularioProducto'

const categorias = [
  { nombre: 'Guitarras Acústicas', imagen: '/img/acustica.png' },
  { nombre: 'Bajos', imagen: '/img/bajo electrico.png' },
]

const llenar = async (codigo) => {
  await userEvent.type(screen.getByLabelText('Código'), codigo)
  await userEvent.type(screen.getByLabelText('Nombre'), 'Guitarra de Prueba')
  await userEvent.type(screen.getByLabelText('Marca'), 'Yamaha')
  await userEvent.type(screen.getByLabelText('Precio (CLP)'), '99990')
  await userEvent.type(screen.getByLabelText('Stock (unidades)'), '5')
}

describe('FormularioProducto', () => {
  it('en modo nuevo muestra el título y el código editable', () => {
    render(<FormularioProducto categorias={categorias} onGuardar={() => {}} onCancelar={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código')).not.toHaveAttribute('readonly')
  })

  it('muestra errores y no guarda si el formulario está vacío', async () => {
    const alGuardar = vi.fn()
    render(<FormularioProducto categorias={categorias} onGuardar={alGuardar} onCancelar={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('Formato: 2 letras y 3 números (ej: GA006).')).toBeInTheDocument()
    expect(screen.getByText('El precio debe ser un número entero mayor a 0.')).toBeInTheDocument()
    expect(alGuardar).not.toHaveBeenCalled()
  })

  it('rechaza un código que ya existe', async () => {
    const alGuardar = vi.fn()
    render(<FormularioProducto categorias={categorias} codigosExistentes={['GA001']} onGuardar={alGuardar} onCancelar={() => {}} />)

    await llenar('GA001')
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('Ya existe un producto con ese código.')).toBeInTheDocument()
    expect(alGuardar).not.toHaveBeenCalled()
  })

  it('guarda el producto con el código en mayúsculas, números y la imagen de la categoría', async () => {
    const alGuardar = vi.fn()
    render(<FormularioProducto categorias={categorias} codigosExistentes={['GA001']} onGuardar={alGuardar} onCancelar={() => {}} />)

    await llenar('ga006')
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(alGuardar).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'GA006',
        precio: 99990,
        stock: 5,
        categoria: 'Guitarras Acústicas',
        imagen: '/img/acustica.png',
      })
    )
  })

  it('en modo edición muestra el código de solo lectura', () => {
    const producto = { codigo: 'GA001', nombre: 'Guitarra Acústica Folk', marca: 'Yamaha', modelo: 'F310', categoria: 'Guitarras Acústicas', precio: 129990, stock: 8, imagen: '', descripcion: '', esOferta: false }
    render(<FormularioProducto productoInicial={producto} categorias={categorias} onGuardar={() => {}} onCancelar={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Editar producto GA001' })).toBeInTheDocument()
    expect(screen.getByLabelText('Código')).toHaveAttribute('readonly')
  })
})