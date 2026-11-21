import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import AdminUsuarios from './AdminUsuarios'
import AdminHistorial from './AdminHistorial'
import { usuariosIniciales } from '../data/usuarios'
import { renderConProveedores, admin, cliente } from '../test/renderConProveedores'

const total = usuariosIniciales.length
const abrir = () => renderConProveedores(<AdminUsuarios />, { ruta: '/admin/usuarios', usuario: admin })

async function llenarNuevoUsuario(nombre, correo) {
  await userEvent.click(screen.getByRole('button', { name: '+ Nuevo usuario' }))
  await userEvent.type(screen.getByLabelText('Nombre completo'), nombre)
  await userEvent.type(screen.getByLabelText('Correo electrónico'), correo)
  await userEvent.type(screen.getByLabelText('Contraseña'), 'clave123')
  await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
}

beforeEach(() => {
  window.scrollTo = vi.fn()
})

describe('Página AdminUsuarios', () => {
  it('lista todos los usuarios (GET /usuarios)', async () => {
    await abrir()
    expect(screen.getByText(`Usuarios registrados (${total})`)).toBeInTheDocument()
  })

  it('crea un usuario nuevo (POST /usuarios)', async () => {
    await abrir()

    await llenarNuevoUsuario('Ana Prueba', 'ana@correo.cl')

    expect(await screen.findByText('Usuario Ana Prueba creado.')).toBeInTheDocument()
    expect(screen.getByText(`Usuarios registrados (${total + 1})`)).toBeInTheDocument()
  })

  it('no permite repetir un correo (409)', async () => {
    await abrir()

    await llenarNuevoUsuario('Otro Cliente', cliente.correo)

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe un usuario con ese correo.')
  })

  it('"Ver pedidos" abre el historial del cliente', async () => {
    await renderConProveedores(
      <Routes>
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/usuarios/:id/pedidos" element={<AdminHistorial />} />
      </Routes>,
      { ruta: '/admin/usuarios', usuario: admin }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Ver pedidos' }))

    expect(await screen.findByRole('heading', { level: 1, name: `Historial de ${cliente.nombre}` })).toBeInTheDocument()
  })
})