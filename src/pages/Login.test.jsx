import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import { renderConProveedores, cliente, admin } from '../test/renderConProveedores'

// Login + páginas falsas para ver a dónde redirige
const conRutas = (ruta = '/login') =>
  renderConProveedores(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<p>Página de inicio</p>} />
      <Route path="/admin" element={<p>Panel admin</p>} />
      <Route path="/checkout" element={<p>Página de pago</p>} />
    </Routes>,
    { ruta }
  )

async function ingresar(correo, password) {
  await userEvent.type(screen.getByLabelText('Correo electrónico'), correo)
  await userEvent.type(screen.getByLabelText('Contraseña'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
}

describe('Página Login', () => {
  it('muestra los errores de validación si se envía vacío', async () => {
    await conRutas()

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument()
  })

  it('avisa si el correo o la contraseña son incorrectos (401)', async () => {
    await conRutas()

    await ingresar(cliente.correo, 'claveMala')

    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
  })

  it('un Cliente que inicia sesión vuelve al inicio', async () => {
    await conRutas()

    await ingresar(cliente.correo, cliente.password)

    expect(await screen.findByText('Página de inicio')).toBeInTheDocument()
  })

  it('un Administrador que inicia sesión va al panel', async () => {
    await conRutas()

    await ingresar(admin.correo, admin.password)

    expect(await screen.findByText('Panel admin')).toBeInTheDocument()
  })

  it('si viene desde otra página, avisa y vuelve a ella al ingresar', async () => {
    await conRutas({ pathname: '/login', state: { desde: '/checkout' } })

    expect(screen.getByText('Debes iniciar sesión para continuar.')).toBeInTheDocument()

    await ingresar(cliente.correo, cliente.password)

    expect(await screen.findByText('Página de pago')).toBeInTheDocument()
  })
})