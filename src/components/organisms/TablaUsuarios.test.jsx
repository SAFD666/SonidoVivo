import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TablaUsuarios from './TablaUsuarios'

const usuarios = [
  { id: 1, nombre: 'Carlos Dueño', correo: 'admin@sonidovivo.cl', rol: 'Administrador', activo: true },
  { id: 3, nombre: 'Cliente Prueba', correo: 'cliente@correo.cl', rol: 'Cliente', activo: false },
]

describe('TablaUsuarios', () => {
  it('muestra si cada usuario está activo o inactivo', () => {
    render(<TablaUsuarios usuarios={usuarios} onEditar={() => {}} />)

    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByText('Inactivo')).toBeInTheDocument()
  })

  it('muestra Ver pedidos solo para los clientes', () => {
    render(<TablaUsuarios usuarios={usuarios} onEditar={() => {}} onVerPedidos={() => {}} />)
    expect(screen.getAllByRole('button', { name: 'Ver pedidos' })).toHaveLength(1)
  })

  it('al pulsar Editar, avisa con el usuario de esa fila', async () => {
    const alEditar = vi.fn()
    render(<TablaUsuarios usuarios={usuarios} onEditar={alEditar} />)

    await userEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0])

    expect(alEditar).toHaveBeenCalledWith(usuarios[0])
  })
})