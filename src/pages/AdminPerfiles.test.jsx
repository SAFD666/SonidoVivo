import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPerfil from './AdminPerfil'
import RutaProtegida from '../components/RutaProtegida'
import { renderConProveedores, admin } from '../test/renderConProveedores'

// Protegida como en App.jsx: la página se muestra cuando la sesión ya se verificó
const abrir = () =>
  renderConProveedores(
    <RutaProtegida roles={['Administrador', 'Vendedor']}><AdminPerfil /></RutaProtegida>,
    { ruta: '/admin/perfil', usuario: admin }
  )

describe('Página AdminPerfil', () => {
  it('muestra los datos del usuario que inició sesión', async () => {
    await abrir()

    expect(screen.getByRole('heading', { level: 1, name: 'Mi perfil' })).toBeInTheDocument()
    expect(screen.getByText(admin.correo)).toBeInTheDocument()
  })

  it('valida que la nueva contraseña tenga al menos 6 caracteres', async () => {
    await abrir()

    await userEvent.type(screen.getByLabelText('Nueva contraseña (opcional)'), 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument()
  })

  it('actualiza el nombre del usuario (PUT /usuarios/{id})', async () => {
    await abrir()
    const campoNombre = screen.getByLabelText('Nombre completo')

    await userEvent.clear(campoNombre)
    await userEvent.type(campoNombre, 'Carlos Nuevo Nombre')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText('Tus datos se actualizaron correctamente.')).toBeInTheDocument()
    expect(screen.getAllByText('Carlos Nuevo Nombre').length).toBeGreaterThan(0)
  })
})