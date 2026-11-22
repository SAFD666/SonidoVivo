import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router-dom'
import Footer from './Footer'
import { renderConProveedores } from '../../test/renderConProveedores'

describe('Footer', () => {
  it('tiene los enlaces a Nosotros, Blog y Contacto', async () => {
    await renderConProveedores(<Footer />)

    expect(screen.getByRole('link', { name: 'Nosotros' })).toHaveAttribute('href', '/nosotros')
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/contacto')
  })

  it('el botón lleva al catálogo', async () => {
    await renderConProveedores(
      <Routes>
        <Route path="/" element={<Footer />} />
        <Route path="/catalogo" element={<p>Página del catálogo</p>} />
      </Routes>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Ver productos disponibles' }))

    expect(screen.getByText('Página del catálogo')).toBeInTheDocument()
  })
})