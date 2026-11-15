import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormularioUsuario from './FormularioUsuario'

const cliente = { id: 3, nombre: 'Cliente Prueba', correo: 'cliente@correo.cl', password: 'cliente123', rol: 'Cliente', activo: true }

describe('FormularioUsuario', () => {
  it('al crear, exige una contraseña de al menos 6 caracteres', async () => {
    const alGuardar = vi.fn()
    render(<FormularioUsuario onGuardar={alGuardar} onCancelar={() => {}} />)

    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.cl')
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument()
    expect(alGuardar).not.toHaveBeenCalled()
  })

  it('crea el usuario con el rol elegido', async () => {
    const alGuardar = vi.fn()
    render(<FormularioUsuario onGuardar={alGuardar} onCancelar={() => {}} />)

    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.cl')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'clave123')
    await userEvent.selectOptions(screen.getByLabelText('Rol'), 'Vendedor')
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(alGuardar).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Juan Pérez', correo: 'juan@correo.cl', rol: 'Vendedor' })
    )
  })

  it('al editar, permite guardar sin cambiar la contraseña', async () => {
    const alGuardar = vi.fn()
    render(<FormularioUsuario usuarioInicial={cliente} onGuardar={alGuardar} onCancelar={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Editar usuario: Cliente Prueba' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(alGuardar).toHaveBeenCalledWith(expect.objectContaining({ id: 3, password: '' }))
  })

  it('no permite desactivar la propia cuenta', () => {
    render(<FormularioUsuario usuarioInicial={cliente} esUsuarioActual={true} onGuardar={() => {}} onCancelar={() => {}} />)
    expect(screen.getByLabelText('Usuario activo (puede iniciar sesión)')).toBeDisabled()
  })
})