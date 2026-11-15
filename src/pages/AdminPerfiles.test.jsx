import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPerfil from './AdminPerfil'
import { renderConProveedores, admin } from '../test/renderConProveedores'

const abrir = () => renderConProveedores(<AdminPerfil />, { ruta: '/admin/perfil', usuario: admin })

describe('Página AdminPerfil', () => {
  it('muestra los datos del usuario que inició sesión', () => {
    abrir()

    expect(screen.getByRole('heading', { level: 1, name: 'Mi perfil' })).toBeInTheDocument()
    expect(screen.getByText(admin.correo)).toBeInTheDocument()
  })

  it('valida que la nueva contraseña tenga al menos 6 caracteres', async () => {
    abrir()

    await userEvent.type(screen.getByLabelText('Nueva contraseña (opcional)'), 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument()
  })

  it('actualiza el nombre del usuario', async () => {
    abrir()
    const campoNombre = screen.getByLabelText('Nombre completo')

    await userEvent.clear(campoNombre)
    await userEvent.type(campoNombre, 'Carlos Nuevo Nombre')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('Tus datos se actualizaron correctamente.')).toBeInTheDocument()
    expect(screen.getAllByText('Carlos Nuevo Nombre').length).toBeGreaterThan(0)
  })
})