import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from './Contacto'
import { renderConProveedores } from '../test/renderConProveedores'

describe('Página Contacto', () => {
  it('muestra los errores si se envía vacío', async () => {
    renderConProveedores(<Contacto />)

    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
  })

  it('muestra la confirmación al enviar un mensaje válido', async () => {
    renderConProveedores(<Contacto />)

    await userEvent.type(screen.getByLabelText('Nombre'), 'Juan Pérez')
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.cl')
    await userEvent.type(screen.getByLabelText('Asunto'), 'Consulta por despacho')
    await userEvent.type(screen.getByLabelText('Mensaje'), '¿Hacen despachos a Concepción?')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('¡Gracias! Recibimos tu mensaje y te responderemos pronto.')).toBeInTheDocument()
  })
})